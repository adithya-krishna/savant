import { db } from '@/db';
import { omit, verifyAndCreateEntry } from '@/lib/utils';
import { handleAPIError } from '@/lib/utils/api-error-handler';
import { EnrollmentUpdateSchema } from '@/lib/validators/enrollment';
import { EnrollmentStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);

  try {
    const isHardDelete = searchParams.get('hardDelete') === 'true';

    let result;
    const message = isHardDelete
      ? 'Enrollment permanently deleted'
      : 'Enrollment soft deleted successfully';

    if (isHardDelete) {
      result = await db.enrollment.delete({ where: { id } });
    } else {
      result = await db.enrollment.update({
        where: { id },
        data: {
          status: EnrollmentStatus.CANCELLED,
          is_deleted: true,
          deleted_at: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: result,
      message,
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
