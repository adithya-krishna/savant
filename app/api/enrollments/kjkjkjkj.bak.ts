// utils/enrollment.ts --------------------------------------------------------

import { db } from '@/lib/db';
import { EnrollmentCreateSchema } from '@/lib/validation';
import {
  EnrollmentError,
  removeEmptyArrays,
  verifyAndCreateEntry,
  getFirstElementIfDefined,
  setManyIfDefined,
} from '@/lib/helpers';
import {
  EnrollmentStatus,
  Prisma,
  PrismaClientKnownRequestError,
} from '@prisma/client';
import { nanoid } from 'nanoid';
import { differenceInCalendarDays } from 'date-fns';

/**
 * 1. Parse + coerce → never call the DB if shape/semantics are wrong.
 */
export function parseBody(body: unknown) {
  const validation = EnrollmentCreateSchema.safeParse(body);
  if (!validation.success) throw validation.error;
  return validation.data;
}

/**
 * 2. Fetch everything we need in *one* round-trip.
 *    Prisma can resolve unrelated promises in parallel inside $transaction([]).
 */
export async function getPrerequisites(
  tx: Prisma.TransactionClient,
  data: ReturnType<typeof parseBody>,
) {
  const [existing, plan, course] = await Promise.all([
    tx.enrollment.findFirst({
      where: {
        student_id: data.student_id,
        course_id: data.course_id,
        plan_code: data.plan_code,
        status: EnrollmentStatus.ACTIVE,
      },
      include: { student: { select: { first_name: true } } },
    }),
    tx.plans.findUnique({
      where: { code: data.plan_code },
      select: { total_slots: true },
    }),
    tx.course.findUnique({
      where: { id: data.course_id },
      include: { teachers: { select: { id: true } } },
    }),
  ]);

  return { existing, plan, course };
}

/**
 * 3. Light-weight guards that *do not* touch the DB.
 */
export function guard(
  { existing, plan, course }: Awaited<ReturnType<typeof getPrerequisites>>,
  data: ReturnType<typeof parseBody>,
) {
  if (existing) {
    throw new EnrollmentError(
      `An active enrollment already exists for ${existing.student.first_name}, with selected plan and course`,
      409,
    );
  }
  if (!plan) {
    throw new EnrollmentError(
      `Plan with code "${data.plan_code}" not found.`,
      400,
    );
  }
  if (!course) {
    throw new EnrollmentError('Course not found.', 400);
  }
  if (!course.teachers.length) {
    throw new EnrollmentError(
      'An instructor is required to create an event',
      400,
    );
  }
}

// handlers/enroll.ts ---------------------------------------------------------

import { NextRequest, NextResponse } from 'next/server';
import { computeEventTimes } from '@/lib/scheduling';
import { parseBody, getPrerequisites, guard } from '@/utils/enrollment';

export async function POST(request: NextRequest) {
  try {
    /* ---------- 1. Pure validation (sync) ------------------------------- */
    const data = parseBody(await request.json());

    const preferredTimeSlots = removeEmptyArrays(data.preferred_time_slots);
    if (!preferredTimeSlots.length)
      throw new EnrollmentError('Time slots required for event creation', 400);
    if (Number.isNaN(data.start_date.getTime()))
      throw new EnrollmentError('Invalid start_date format', 400);

    /* ---------- 2. One touch to the DB for pre-checks ------------------- */
    const result = await db.$transaction(async tx => {
      const prereq = await getPrerequisites(tx, data);
      guard(prereq, data);

      const totalSlots = prereq.plan!.total_slots;
      const teacherIds = prereq.course!.teachers.map(t => t.id);
      const firstTeacher = teacherIds[0];

      const eventTimes = computeEventTimes(
        totalSlots,
        preferredTimeSlots,
        data.start_date,
      );

      /* ---------- 3. Create enrollment + events in the same txn ---------- */
      const enrollmentId = nanoid(14);
      const createdEnrollment = await tx.enrollment.create({
        data: {
          id: enrollmentId,
          ...verifyAndCreateEntry('amount_paid', data.amount_paid),
          ...Prisma.validator<typeof data>()(data), // omit mutable props
          slots_remaining: totalSlots,
        },
        include: {
          student: { select: { id: true, first_name: true, last_name: true } },
        },
      });

      // Build create / update payloads first, then run Promise.all for speed.
      const eventPromises = eventTimes.map(({ start, end }, i) =>
        tx.event.upsert({
          where: {
            // requires a composite unique index on (start_date_time, end_date_time, host_id)
            host_id_start_date_time_end_date_time: {
              host_id: firstTeacher,
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
          include: { id: true },
        }),
      );

      await Promise.all(eventPromises);

      return { createdEnrollment, totalEventsProcessed: eventTimes.length };
    });

    /* ---------- 4. Respond ------------------------------------------------ */
    return NextResponse.json({
      message: 'Enrollment created and linked to events',
      ...result,
    });
  } catch (err) {
    return handleAPIError(err);
  }
}
