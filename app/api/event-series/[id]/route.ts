import { db } from '@/db';
import { handleAPIError } from '@/lib/utils/api-error-handler';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await db.eventSeries.delete({ where: { id } });
    return NextResponse.json({
      success: true,
      message: 'Event deleted permanantly',
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
