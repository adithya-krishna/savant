import { db } from '@/db';
import { handleAPIError } from '@/lib/utils/api-error-handler';
import { EventSeriesCreateSchema } from '@/lib/validators/event-series';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const eventSeries = await db.eventSeries.findMany();
    return NextResponse.json(eventSeries);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = EventSeriesCreateSchema.safeParse(body);

    if (!validation.success) {
      throw validation.error;
    }

    const eventSeries = await db.eventSeries.create({
      data: {
        id: nanoid(14),
        ...validation.data,
      },
    });

    return NextResponse.json(eventSeries);
  } catch (error) {
    return handleAPIError(error);
  }
}
