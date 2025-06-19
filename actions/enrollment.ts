'use server';

import { db } from '@/db';
import {
  computeEventTimes,
  omit,
  removeEmptyArrays,
  verifyAndCreateEntry,
} from '@/lib/utils';
import { getPrerequisites, parseBody } from '@/lib/utils/api-utils';
import { EnrollmentCreateInput } from '@/lib/validators/enrollment';
import { nanoid } from 'nanoid';

function getFirstElementIfDefined(arr: string[]) {
  if (Array.isArray(arr) && arr.length > 0 && arr[0] !== undefined) {
    return arr[0];
  }
  return undefined;
}

export async function enroll(values: EnrollmentCreateInput) {
  try {
    const data = parseBody(values);

    if (!data.preferred_time_slots)
      return { error: 'Time slots required for event creation' };

    const preferredTimeSlots = removeEmptyArrays(data.preferred_time_slots);

    if (Number.isNaN(data.start_date.getTime()))
      return { error: 'Invalid start_date format' };

    const result = await db.$transaction(async tx => {
      const prereq = await getPrerequisites(tx, data);
      const { existing, plan, course } = prereq;

      if (existing) {
        return {
          error: `An active enrollment already exists for ${existing.student.first_name}, with selected plan and course`,
        };
      }
      if (!plan) {
        return { error: `Plan with code "${data.plan_code}" not found.` };
      }
      if (!course) {
        return { error: 'Course not found.' };
      }
      if (!course.teachers.length) {
        return { error: 'An instructor is required to create an event' };
      }

      const totalSlots = plan!.total_slots;
      const firstTeacher = getFirstElementIfDefined(
        course!.teachers.map(t => t.id),
      );

      const eventTimes = computeEventTimes(
        totalSlots,
        preferredTimeSlots,
        data.start_date,
      );

      const enrollmentId = nanoid(14);
      await tx.enrollment.create({
        data: {
          id: enrollmentId,
          ...omit(data, ['amount_paid']),
          ...verifyAndCreateEntry('amount_paid', data.amount_paid),
          slots_remaining: totalSlots,
        },
        include: {
          student: { select: { id: true, first_name: true, last_name: true } },
        },
      });

      const eventPromises = eventTimes.map(({ start, end }, i) =>
        tx.event.upsert({
          where: {
            host_id_start_date_time_end_date_time: {
              host_id: firstTeacher!,
              start_date_time: start,
              end_date_time: end,
            },
          },
          create: {
            id: nanoid(20),
            title: `Session ${i + 1} | ${prereq.course!.name}`,
            description: `Auto-generated session ${i + 1} for enrollment`,
            start_date_time: start,
            end_date_time: end,
            host: { connect: { id: firstTeacher } },
            guests: { connect: [{ id: enrollmentId }] },
          },
          update: {
            guests: { connect: [{ id: enrollmentId }] },
          },
        }),
      );

      await Promise.all(eventPromises);
    });

    return {
      message: 'Enrollment created and linked to events',
      enrollment: result,
    };
  } catch (error) {
    return { error };
  }
}
