import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { updateLeadSchema } from "@/lib/validators/lead";
import { Decimal } from "@prisma/client/runtime/library";

function getIdFromReq(req: NextRequest) {
  const segments = new URL(req.url).pathname.split("/");
  return segments.pop()!;
}

export async function PUT(request: NextRequest) {
  const id = getIdFromReq(request);

  // 1) Read & validate
  const body = await request.json();
  const parsed = updateLeadSchema.parse({ id, ...body });

  // 2) Build the update payload, converting types Prisma expects
  const updateData: Parameters<typeof db.leads.update>[0]["data"] = {
    first_name: parsed.first_name,
    last_name: parsed.last_name || undefined,
    country_code: parsed.country_code,
    phone: parsed.phone,
    email: parsed.email || undefined,
    parent_name: parsed.parent_name || undefined,
    parent_phone: parsed.parent_phone || undefined,
    source: parsed.source || undefined,
    source_detail: parsed.source_detail || undefined,
    how_heard_about_us: parsed.how_heard_about_us || undefined,
    walkin_date: parsed.walkin_date ? new Date(parsed.walkin_date) : undefined,
    location_name: parsed.location_name || undefined,
    subject_interested: parsed.subject_interested || undefined,
    expected_budget: parsed.expected_budget
      ? new Decimal(parsed.expected_budget)
      : undefined,
    stage: {
      connect: { id: parsed.stage_id! },
    },
    demo_taken: parsed.demo_taken,
    color_code: parsed.color_code || undefined,
    number_of_contact_attempts: parsed.number_of_contact_attempts,
    last_contacted_date: parsed.last_contacted_date
      ? new Date(parsed.last_contacted_date)
      : undefined,
    next_followup: parsed.next_followup
      ? new Date(parsed.next_followup)
      : undefined,
    counselors: {
      connect: { id: parsed.counselor_id! },
    },
  };

  // 3) Persist
  const lead = await db.leads.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(lead);
}

// Delete a lead
export async function DELETE(request: NextRequest) {
  const id = getIdFromReq(request);
  await db.leads.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
