import { db } from '@/db';
import { notFound } from 'next/navigation';
import LeadForm from '@/components/lead-form';
import { CreateLeadInput } from '@/lib/validators/lead';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadPage({ params }: PageProps) {
  const { id } = await params;
  let initialData: CreateLeadInput | null = null;

  if (id !== 'new') {
    const raw = await db.leads.findUnique({ where: { id } });
    if (!raw) notFound();

    initialData = {
      first_name: raw.first_name,
      last_name: raw.last_name ?? '',
      phone: raw.phone,
      email: raw.email ?? '',
      source_id: raw.source_id ?? '',
      walkin_date: raw.walkin_date
        ? raw.walkin_date.toISOString().split('T')[0]
        : '',
      address: raw.address ?? '',
      expected_budget: raw.expected_budget?.toString() ?? '',
      stage_id: raw.stage_id ?? '',
      demo_taken: raw.demo_taken ?? false,
      color_code: raw.color_code ?? '#000000',
      number_of_contact_attempts: raw.number_of_contact_attempts ?? 0,
      last_contacted_date: raw.last_contacted_date
        ? raw.last_contacted_date.toISOString().slice(0, 16)
        : '',
      next_followup: raw.next_followup
        ? raw.next_followup.toISOString().slice(0, 16)
        : '',
      team_member_id: raw.team_member_id ?? '',
    };
  }

  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      <div className="flex w-full flex-col p-4 md:w-72 md:shrink-0">
        <h1 className="mb-2 text-2xl font-semibold">
          {id === 'new' ? 'Add Lead' : 'Edit Lead'}
        </h1>
        <p className="text-sm text-gray-400">
          Update lead details, assign team members, and track changes to keep
          your pipeline accurate and current.
        </p>
      </div>
      <div className="flex h-full w-full md:h-auto p-4">
        <LeadForm initialData={initialData} id={id} />
      </div>
    </div>
  );
}
