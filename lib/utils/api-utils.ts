import { NextRequest } from 'next/server';
import { APIError } from './api-error-handler';
import { EnrollmentCreateSchema } from '../validators/enrollment';
import { EnrollmentStatus, Prisma } from '@prisma/client';
import { toZonedTime } from 'date-fns-tz';
import { formatISO } from 'date-fns';

export const getIdFromReq = (request: NextRequest) => {
  const id = request.nextUrl.pathname.split('/').pop();
  if (!id) throw new APIError('Instrument ID is required', 400);
  return id;
};

export type FetchResult<T> = {
  data: T | null;
  error: string | null;
  endpoint: string;
};

export async function fetchEndpointsParallel<T = unknown>(
  endpoints: string[],
  options?: RequestInit,
): Promise<FetchResult<T>[]> {
  try {
    const responses = await Promise.all(
      endpoints.map(endpoint => fetch(endpoint, options)),
    );

    const results: Promise<FetchResult<T>>[] = responses.map(
      async (res, index) => {
        if (!res.ok) {
          return {
            data: null,
            error: `Request failed with status ${res.status} for ${endpoints[index]}`,
            endpoint: endpoints[index],
          };
        }

        try {
          const data = await res.json();
          return {
            data,
            error: null,
            endpoint: endpoints[index],
          };
        } catch (parseError) {
          console.error(parseError);
          return {
            data: null,
            error: `Failed to parse JSON for ${endpoints[index]}`,
            endpoint: endpoints[index],
          };
        }
      },
    );

    return await Promise.all(results);
  } catch (error) {
    console.error(error);
    // Handle network errors or other fetch failures
    return endpoints.map(endpoint => ({
      data: null,
      error: `Network error occurred while fetching ${endpoint}`,
      endpoint,
    }));
  }
}

// enrollment error
export class EnrollmentError extends Error {
  status: number;
  constructor(message: string, status: number = 400) {
    super(message);
    this.name = 'EnrollmentError';
    this.status = status;
  }
}

export function parseBody(body: unknown) {
  const validation = EnrollmentCreateSchema.safeParse(body);
  if (!validation.success) throw validation.error;
  return validation.data;
}

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

export function guard(
  prereq: Awaited<ReturnType<typeof getPrerequisites>>,
  data: ReturnType<typeof parseBody>,
) {
  const { existing, plan, course } = prereq;
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

export function toZonedISOString(
  date: Date | string,
  timeZone: string,
): string {
  const utcDate = typeof date === 'string' ? new Date(date) : date;
  const zonedDate = toZonedTime(utcDate, timeZone);
  return formatISO(zonedDate, { representation: 'complete' });
}
