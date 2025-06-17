import { db } from '@/db';
import { connectIfDefined, connectManyIfDefined, omit } from '@/lib/utils';
import { APIError, handleAPIError } from '@/lib/utils/api-error-handler';
import { CourseCreateSchema } from '@/lib/validators/course';
import { CourseDifficulty } from '@prisma/client';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const course = await db.course.findMany({
      orderBy: { name: 'asc' },
      include: {
        teachers: { select: { id: true } },
      },
    });
    return NextResponse.json(course);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = CourseCreateSchema.safeParse(body);
    if (!validation.success) {
      throw validation.error;
    }

    const { difficulty, instrument_id, description } = validation.data;

    let name: string;
    if (instrument_id) {
      const instrument = await db.instruments.findUnique({
        where: { id: instrument_id },
        select: { name: true },
      });
      if (!instrument) throw new APIError('Instrument not found');
      name = `${instrument.name} | ${difficulty}`;
    } else {
      name = difficulty ?? CourseDifficulty.FOUNDATION;
    }

    const course = await db.course.create({
      data: {
        id: nanoid(14),
        ...omit(validation.data, ['instrument_id', 'teachers']),
        name,
        difficulty,
        description,
        ...connectIfDefined('instrument', validation.data.instrument_id),
        ...connectManyIfDefined('teachers', validation.data.teachers),
      },
      include: {
        teachers: { select: { id: true } },
      },
    });

    return NextResponse.json({
      message: 'Course created successfully',
      course,
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
