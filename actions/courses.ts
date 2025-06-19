'use server';

import { db } from '@/db';
import { nanoid } from 'nanoid';
import {
  CourseCreateInput,
  CourseCreateSchema,
  CourseUpdateInput,
  CourseUpdateSchema,
} from '@/lib/validators/course';
import { CourseError } from '@/lib/errors';
import { CourseDifficulty } from '@/lib/enums';
import { connectIfDefined, connectManyIfDefined, omit } from '@/lib/utils';

export async function createCourse(values: CourseCreateInput) {
  const validation = CourseCreateSchema.safeParse(values);
  if (!validation.success) {
    const issue = validation.error.errors[0];
    throw new CourseError(issue.path[0] as string, issue.message);
  }

  console.log('+++++++++++++++');
  console.log('validation', validation.data);
  console.log('+++++++++++++++');

  const { difficulty, instrument_id, description } = validation.data;
  let name: string;

  if (instrument_id) {
    const instrument = await db.instruments.findUnique({
      where: { id: instrument_id },
      select: { name: true },
    });
    if (!instrument)
      throw new CourseError('instrument_id', 'Instrument not found');
    name = `${instrument.name} | ${difficulty}`;
  } else {
    name = difficulty ?? CourseDifficulty.FOUNDATION;
  }

  const existing = await db.course.findUnique({ where: { name } });
  if (existing) throw new CourseError('name', 'Course name must be unique');

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
  });

  return { message: 'Course created successfully', course };
}

export async function updateCourse(values: CourseUpdateInput & { id: string }) {
  const validation = CourseUpdateSchema.safeParse(values);
  if (!validation.success) {
    const issue = validation.error.errors[0];
    throw new CourseError(issue.path[0] as string, issue.message);
  }

  const { id, difficulty, instrument_id, description } = validation.data;
  let name: string;

  if (instrument_id) {
    const instrument = await db.instruments.findUnique({
      where: { id: instrument_id },
      select: { name: true },
    });
    if (!instrument)
      throw new CourseError('instrument_id', 'Instrument not found');
    name = `${instrument.name} | ${difficulty}`;
  } else {
    name = difficulty!;
  }

  const existing = await db.course.findUnique({ where: { name } });
  if (existing && existing.id !== id)
    throw new CourseError('name', 'Course name must be unique');

  await db.course.update({
    where: { id },
    data: {
      name,
      difficulty,
      description,
      instrument_id,
    },
  });

  return { message: 'Course updated successfully' };
}
