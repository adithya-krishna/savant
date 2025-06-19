import { db } from '@/db';
import {
  computeEventTimes,
  omit,
  removeEmptyArrays,
  verifyAndCreateEntry,
} from '@/lib/utils';
import { handleAPIError } from '@/lib/utils/api-error-handler';
import {
  EnrollmentError,
  getPrerequisites,
  guard,
  parseBody,
} from '@/lib/utils/api-utils';
import { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';

function getFirstElementIfDefined(arr: string[]) {
  if (Array.isArray(arr) && arr.length > 0 && arr[0] !== undefined) {
    return arr[0];
  }
  return undefined;
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const studentId = url.searchParams.get('studentId');

  const where: Prisma.EnrollmentWhereInput = {};

  if (studentId) {
    where.student_id = studentId;
  }

  try {
    const enrollment = await db.enrollment.findMany({
      orderBy: { create_date: 'desc' },
      where,
    });
    return NextResponse.json(enrollment);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = parseBody(await request.json());

    if (!data.preferred_time_slots)
      throw new EnrollmentError('Time slots required for event creation', 400);

    const preferredTimeSlots = removeEmptyArrays(data.preferred_time_slots);

    if (Number.isNaN(data.start_date.getTime()))
      throw new EnrollmentError('Invalid start_date format', 400);

    const result = await db.$transaction(async tx => {
      const prereq = await getPrerequisites(tx, data);
      const { plan, course } = prereq;
      guard(prereq, data);

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

    return NextResponse.json({
      message: 'Enrollment created and linked to events',
      enrollment: result,
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
