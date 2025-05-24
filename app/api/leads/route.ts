import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { createLeadSchema } from '@/lib/validators/lead';
import { nanoid } from 'nanoid';
import { connectIfDefined, connectManyIfDefined, omit } from '@/lib/utils';
import { handleAPIError } from '@/lib/utils/api-error-handler';

export async function GET() {
  const leads = await db.leads.findMany({
    orderBy: { create_date: 'desc' },
    include: {
      stage: true,
      team_member: true,
      source: true,
      instruments: true,
    },
  });
  return NextResponse.json(leads);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createLeadSchema.safeParse(body);

    if (!validation.success) {
      throw validation.error;
    }

    const id = nanoid(14);

    const lead = await db.leads.create({
      data: {
        id,
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

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    return handleAPIError(error);
  }
}
