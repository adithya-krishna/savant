import { db } from '@/db';
import { omit, setManyIfDefined } from '@/lib/utils';
import { handleAPIError } from '@/lib/utils/api-error-handler';
import { updateEventSchema } from '@/lib/validators/events';
import { NextRequest, NextResponse } from 'next/server';

/** GET /api/events/:id */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const event = await db.event.findUnique({
    where: { id },
    include: { guests: true },
  });
  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }
  return NextResponse.json(event);
}

/** PATCH /api/events/:id */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validation = updateEventSchema.safeParse({ ...body, id });

    if (!validation.success) {
      throw validation.error;
    }

    const event = await db.event.update({
      where: { id },
      data: {
        ...omit(validation.data, ['guests']),
        ...setManyIfDefined('guests', validation.data.guests),
      },
      include: {
        guests: true,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    return handleAPIError(error);
  }
}

/** DELETE /api/events/:id */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await db.event.delete({ where: { id } });
    return NextResponse.json({
      success: true,
      message: 'Event deleted permanantly',
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
