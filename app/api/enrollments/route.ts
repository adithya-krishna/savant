import { db } from '@/db';
import { handleAPIError } from '@/lib/utils/api-error-handler';
import { EnrollmentCreateSchema } from '@/lib/validators/enrollment';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const enrollment = await db.enrollment.findMany({
      orderBy: { create_date: 'asc' },
    });
    return NextResponse.json(enrollment);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = EnrollmentCreateSchema.safeParse(body);
    if (!validation.success) {
      throw validation.error;
    }

    const enrollment = await db.enrollment.create({
      data: {
        id: nanoid(14),
        ...validation.data,
      },
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    return handleAPIError(error);
  }
}
