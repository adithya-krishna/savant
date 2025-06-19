import { db } from '@/db';
import { connectIfDefined, connectManyIfDefined, omit } from '@/lib/utils';
import { handleAPIError } from '@/lib/utils/api-error-handler';
import { toZonedISOString } from '@/lib/utils/api-utils';
import { createEventSchema } from '@/lib/validators/events';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const page = Number(request.nextUrl.searchParams.get('page') ?? 1);
  const pageSize = Number(request.nextUrl.searchParams.get('size') ?? 20);

  const [events, total] = await Promise.all([
    db.event.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { start_date_time: 'asc' },
      include: {
        guests: true,
        host: true,
      },
    }),
    db.event.count(),
  ]);

  const timeZone =
    request.nextUrl.searchParams.get('tz') ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const result = events.map(event => ({
    ...event,
    start_date_time: toZonedISOString(event.start_date_time, timeZone),
    end_date_time: toZonedISOString(event.end_date_time, timeZone),
  }));

  return NextResponse.json({
    data: result,
    meta: { page, pageSize, total },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = createEventSchema.safeParse(body);
    if (!validation.success) {
      throw validation.error;
    }

    const event = await db.event.create({
      data: {
        id: nanoid(14),
        ...omit(validation.data, ['host_id', 'created_by_id', 'guests']),
        host: { connect: { id: validation.data.host_id } },
        ...connectIfDefined('created_by', validation.data.created_by_id),
        ...connectManyIfDefined('guests', validation.data.guests),
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    handleAPIError(error);
  }
}
