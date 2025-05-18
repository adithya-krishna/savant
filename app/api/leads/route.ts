import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { createLeadSchema } from "@/lib/validators/lead";
import { nanoid } from "nanoid";
import { Decimal } from "@prisma/client/runtime/library";
import { connectIfDefined } from "@/lib/utils";

export async function GET() {
  const leads = await db.leads.findMany({
    orderBy: { create_date: "desc" },
    include: {
      stage: true,
      team_member: true,
      source: true,
      instrument: true,
    },
  });
  return NextResponse.json(leads);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = createLeadSchema.parse(body);

  // Generate a 14-char ID
  const id = nanoid(14);

  // Create the lead
  const lead = await db.leads.create({
    data: {
      id,
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      email: data.email,
      walkin_date: data.walkin_date ? new Date(data.walkin_date) : undefined,
      address: data.address,
      area: data.area,
      expected_budget: data.expected_budget
        ? new Decimal(data.expected_budget)
        : undefined,
      demo_taken: data.demo_taken,
      color_code: data.color_code,
      number_of_contact_attempts: data.number_of_contact_attempts,
      last_contacted_date: data.last_contacted_date
        ? new Date(data.last_contacted_date)
        : undefined,
      next_followup: data.next_followup
        ? new Date(data.next_followup)
        : undefined,
      ...connectIfDefined("source_id", data.source_id),
      ...connectIfDefined("instrument_id", data.instrument_id),
      ...connectIfDefined("stage_id", data.stage_id),
      ...connectIfDefined("team_member_id", data.team_member_id),
    },
  });

  return NextResponse.json(lead, { status: 201 });
}
