import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { InstrumentUpdateSchema } from '@/lib/validators/instruments';
import {
  handleAPIError,
  APIError,
  checkUniqueName,
} from '@/lib/utils/api-error-handler';
import { getIdFromReq } from '@/lib/utils/api-utils';

export async function PUT(request: NextRequest) {
  try {
    const id = getIdFromReq(request);
    const body = await request.json();

    const validation = InstrumentUpdateSchema.safeParse({ id, ...body });
    if (!validation.success) {
      throw validation.error;
    }

    if (validation.data.name) {
      const isUnique = await checkUniqueName(validation.data.name, id);
      if (!isUnique) {
        throw new APIError('Instrument name must be unique', 409);
      }
    }

    const instrument = await db.instruments.update({
      where: { id },
      data: {
        name: validation.data.name,
        description: validation.data.description ?? undefined,
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    return NextResponse.json(instrument);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = getIdFromReq(request);

    const existingInstrument = await db.instruments.findUnique({
      where: { id },
    });
    if (!existingInstrument) {
      throw new APIError('Instrument not found', 404);
    }

    const coursesUsingInstrument = await db.course.count({
      where: { instrument_id: id },
    });

    if (coursesUsingInstrument > 0) {
      throw new APIError(
        'Cannot delete instrument as it is being used in courses',
        400,
      );
    }

    await db.instruments.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return handleAPIError(error);
  }
}
