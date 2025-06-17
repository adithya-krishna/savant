'use server';

import { db } from '@/db';
import {
  computeEventTimes,
  omit,
  setManyIfDefined,
  verifyAndCreateEntry,
} from '@/lib/utils';
import {
  EnrollmentCreateInput,
  EnrollmentCreateSchema,
} from '@/lib/validators/enrollment';
import { nanoid } from 'nanoid';

export async function enroll(values: EnrollmentCreateInput) {
  const validation = EnrollmentCreateSchema.safeParse(values);

  if (!validation.success) {
    throw validation.error;
  }

  const { plan_code, start_date, preferred_time_slots } = validation.data;

  if (!preferred_time_slots) {
    return { error: 'time slots required for event creation' };
  }

  if (isNaN(start_date.getTime())) {
    return { error: 'Invalid start_date format' };
  }

  const plan = await db.plans.findUnique({
    where: { code: plan_code },
    select: { total_slots: true },
  });
  if (!plan) {
    return { error: `Plan with code "${plan_code}" not found.` };
  }
  const totalSlots = plan.total_slots;

  let eventTimes: { start: Date; end: Date }[];
  try {
    eventTimes = computeEventTimes(
      totalSlots,
      preferred_time_slots,
      start_date,
    );
  } catch {
    return { error: 'unable to compute event times' };
  }

  const result = await db.$transaction(async tx => {
    const enrollmentData = {
      id: nanoid(14),
      ...omit(validation.data, ['amount_paid']),
      ...verifyAndCreateEntry('amount_paid', validation.data.amount_paid),
    };

    const currentCourse = await tx.course.findUnique({
      where: { id: enrollmentData.course_id },
      include: { teachers: { select: { id: true } } },
    });
    if (!currentCourse) {
      return { error: `Course not found.` };
    }
    const teacherIds = currentCourse.teachers.map(t => t.id) || [];

    const createdEnrollment = await tx.enrollment.create({
      data: enrollmentData,
    });

    for (let i = 0; i < eventTimes.length; i++) {
      const { start, end } = eventTimes[i];
      const existingEvent = await tx.event.findFirst({
        where: {
          host_id: {
            in: teacherIds,
          },
          start_date_time: start,
          end_date_time: end,
        },
        include: {
          guests: { select: { id: true } },
        },
      });

      let eventId: string;
      if (existingEvent) {
        eventId = existingEvent.id;
        await tx.event.update({
          where: { id: eventId },
          data: {
            ...setManyIfDefined('guests', [
              ...existingEvent.guests.map(g => g.id),
              validation.data.student_id,
            ]),
          },
        });
      } else {
        eventId = nanoid(20);
        const title = `Session ${i + 1}`;
        const description = `Auto-generated session ${i + 1} for enrollment`;
        await tx.event.create({
          data: {
            id: eventId,
            title,
            description,
            start_date_time: start,
            end_date_time: end,
            host_id: teacherIds[0],
            ...setManyIfDefined('guests', [validation.data.student_id]),
          },
        });
      }
    }

    return { createdEnrollment, totalEventsProcessed: eventTimes.length };
  });

  return { message: 'Enrollment created and linked to events', ...result };
}
