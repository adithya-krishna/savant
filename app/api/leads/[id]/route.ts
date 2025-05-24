import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/db';
import { updateLeadSchema } from '@/lib/validators/lead';
import { connectIfDefined, connectManyIfDefined, omit } from '@/lib/utils';
import { getIdFromReq } from '@/lib/utils/api-utils';
import { handleAPIError } from '@/lib/utils/api-error-handler';

export async function PUT(request: NextRequest) {
  const id = getIdFromReq(request);
  try {
    const body = await request.json();
    const validation = updateLeadSchema.safeParse(body);

    if (!validation.success) {
      throw validation.error;
    }

    const lead = await db.leads.update({
      where: { id },
      data: {
        ...omit(validation.data, [
          'source_id',
          'instrument_ids',
          'stage_id',
          'team_member_id',
        ]),
        ...connectIfDefined('source', validation.data.source_id),
        ...connectManyIfDefined('instruments', validation.data.instrument_ids),
        ...connectIfDefined(
          'stage',
          validation.data.stage_id || 'QMbQIk4rWPwiYW',
        ),
        ...connectIfDefined('team_member', validation.data.team_member_id),
      },
    });

    return NextResponse.json(lead);
  } catch (error) {
    handleAPIError(error);
  }
}

export async function DELETE(request: NextRequest) {
  const id = getIdFromReq(request);
  await db.leads.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
