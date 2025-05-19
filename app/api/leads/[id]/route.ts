import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/db';
import { updateLeadSchema } from '@/lib/validators/lead';
import { Decimal } from '@prisma/client/runtime/library';
import { connectIfDefined, connectManyIfDefined } from '@/lib/utils';
import { getIdFromReq } from '@/lib/utils/api-utils';

export async function PUT(request: NextRequest) {
  const id = getIdFromReq(request);

  const body = await request.json();
  const parsed = updateLeadSchema.parse({ id, ...body });

  const updateData: Parameters<typeof db.leads.update>[0]['data'] = {
    first_name: parsed.first_name,
    last_name: parsed.last_name || undefined,
    phone: parsed.phone,
    email: parsed.email || undefined,
    walkin_date: parsed.walkin_date ? new Date(parsed.walkin_date) : undefined,
    address: parsed.address || undefined,
    area: parsed.area || undefined,
    expected_budget: parsed.expected_budget
      ? new Decimal(parsed.expected_budget)
      : undefined,
    demo_taken: parsed.demo_taken,
    color_code: parsed.color_code || undefined,
    number_of_contact_attempts: parsed.number_of_contact_attempts,
    last_contacted_date: parsed.last_contacted_date
      ? new Date(parsed.last_contacted_date)
      : undefined,
    next_followup: parsed.next_followup
      ? new Date(parsed.next_followup)
      : undefined,
    ...connectIfDefined('source', parsed.source_id),
    ...connectManyIfDefined('instruments', parsed.instrument_ids),
    ...connectIfDefined('stage', parsed.stage_id),
    ...connectIfDefined('team_member', parsed.team_member_id),
  };

  const lead = await db.leads.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(lead);
}

export async function DELETE(request: NextRequest) {
  const id = getIdFromReq(request);
  await db.leads.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
