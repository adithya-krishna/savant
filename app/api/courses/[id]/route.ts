import { db } from '@/db';
import { handleAPIError } from '@/lib/utils/api-error-handler';
import { getIdFromReq } from '@/lib/utils/api-utils';
import { CourseUpdateSchema } from '@/lib/validators/course';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  const id = getIdFromReq(request);

  try {
    const body = await request.json();
    const validation = CourseUpdateSchema.safeParse({ id, ...body });
    if (!validation.success) {
      throw validation.error;
    }

    const course = await db.course.update({
      where: { id },
      data: validation.data,
    });

    return NextResponse.json(course);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function DELETE(request: NextRequest) {
  const id = getIdFromReq(request);
  try {
    await db.course.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleAPIError(error);
  }
}
