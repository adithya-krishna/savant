import { db } from "@/db";
import { notFound } from "next/navigation";
import LeadForm from "@/components/lead-form";
import { CreateLeadInput } from "@/lib/validators/lead";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadPage({ params }: PageProps) {
  const { id } = await params;
  let initialData: CreateLeadInput | null = null;

  if (id !== "new") {
    const raw = await db.leads.findUnique({ where: { id } });
    if (!raw) notFound();

    // Convert Decimal and Date fields to primitives
    initialData = {
      first_name: raw.first_name,
      last_name: raw.last_name ?? "",
      country_code: raw.country_code ?? "+91",
      phone: raw.phone,
      email: raw.email ?? "",
      parent_name: raw.parent_name ?? "",
      parent_phone: raw.parent_phone ?? "",
      source: raw.source ?? "",
      source_detail: raw.source_detail ?? "",
      how_heard_about_us: raw.how_heard_about_us ?? "",
      walkin_date: raw.walkin_date
        ? raw.walkin_date.toISOString().split("T")[0]
        : "",
      location_name: raw.location_name ?? "",
      subject_interested: raw.subject_interested ?? "",
      expected_budget: raw.expected_budget?.toString() ?? "",
      stage: raw.stage ?? "",
      demo_taken: raw.demo_taken ?? false,
      color_code: raw.color_code ?? "#000000",
      number_of_contact_attempts: raw.number_of_contact_attempts ?? 0,
      last_contacted_date: raw.last_contacted_date
        ? raw.last_contacted_date.toISOString().slice(0, 16)
        : "",
      next_followup: raw.next_followup
        ? raw.next_followup.toISOString().slice(0, 16)
        : "",
      counselor_id: raw.counselor_id ?? "",
    };
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6">
        {id === "new" ? "Add Lead" : "Edit Lead"}
      </h1>
      <LeadForm initialData={initialData} id={id} />
    </div>
  );
}
