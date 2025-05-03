import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { createLeadSchema } from "@/lib/validators/lead";
import { nanoid } from "nanoid";
import { Decimal } from "@prisma/client/runtime/library";

// GET /api/leads — return all leads
export async function GET() {
  const leads = await db.leads.findMany({
    orderBy: { create_date: "desc" },
  });
  return NextResponse.json(leads);
}

export async function POST(request: Request) {
  // Parse and validate payload
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
      country_code: data.country_code,
      phone: data.phone,
      email: data.email,
      parent_name: data.parent_name,
      parent_phone: data.parent_phone,
      source: data.source,
      source_detail: data.source_detail,
      how_heard_about_us: data.how_heard_about_us,
      walkin_date: data.walkin_date ? new Date(data.walkin_date) : undefined,
      location_name: data.location_name,
      subject_interested: data.subject_interested,
      expected_budget: data.expected_budget
        ? new Decimal(data.expected_budget)
        : undefined,
      stage: data.stage,
      demo_taken: data.demo_taken,
      color_code: data.color_code,
      number_of_contact_attempts: data.number_of_contact_attempts,
      last_contacted_date: data.last_contacted_date
        ? new Date(data.last_contacted_date)
        : undefined,
      next_followup: data.next_followup
        ? new Date(data.next_followup)
        : undefined,
      counselor_id: data.counselor_id,
    },
  });

  return NextResponse.json(lead, { status: 201 });
}
