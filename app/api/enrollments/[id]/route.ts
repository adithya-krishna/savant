import { db } from '@/db';
import { omit, verifyAndCreateEntry } from '@/lib/utils';
import { handleAPIError } from '@/lib/utils/api-error-handler';
import { getIdFromReq } from '@/lib/utils/api-utils';
import { EnrollmentUpdateSchema } from '@/lib/validators/enrollment';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  const id = getIdFromReq(request);
  try {
    const body = await request.json();
    const validation = EnrollmentUpdateSchema.safeParse({ id, ...body });

    if (!validation.success) {
      throw validation.error;
    }

    const enrollment = await db.enrollment.update({
      where: { id },
      data: {
        ...omit(validation.data, ['amount_paid']),
        ...verifyAndCreateEntry('amount_paid', validation.data.amount_paid),
      },
    });

    return NextResponse.json(enrollment);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function DELETE(request: NextRequest) {
  const id = getIdFromReq(request);

  try {
    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get('hardDelete') === 'true';

    const input = EnrollmentUpdateSchema.parse({ id });

    let result;
    if (hardDelete) {
      result = db.enrollment.delete({ where: { id } });
    } else {
      result = await db.enrollment.update({
        where: { id: input.id },
        data: {
          is_deleted: true,
          deleted_at: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: hardDelete
        ? 'Enrollment permanently deleted'
        : 'Enrollment soft deleted successfully',
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
