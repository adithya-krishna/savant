import { db } from '@/db';
import { omit, priceToInt } from '@/lib/utils';
import { handleAPIError } from '@/lib/utils/api-error-handler';
import { EnrollmentCreateSchema } from '@/lib/validators/enrollment';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';

function verifyAndConnect<T extends string | number>(
  key: string,
  value?: T,
): Record<string, T> | object {
  if (value === undefined) {
    return {};
  } else if (typeof value === 'number') {
    return { [key]: Number(value) };
  } else if (!isNaN(parseFloat(value ?? '')) && isFinite(Number(value))) {
    return { [key]: priceToInt(Number(value)) };
  }
  return {};
}

export async function GET() {
  try {
    const enrollment = await db.enrollment.findMany({
      orderBy: { create_date: 'desc' },
    });
    return NextResponse.json(enrollment);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = EnrollmentCreateSchema.safeParse(body);
    if (!validation.success) {
      throw validation.error;
    }

    const enrollment = await db.enrollment.create({
      data: {
        id: nanoid(14),
        ...omit(validation.data, ['amount_paid']),
        ...verifyAndConnect('amount_paid', validation.data.amount_paid),
      },
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    return handleAPIError(error);
  }
}
