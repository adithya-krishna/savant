import { db } from '@/db';
import { notFound } from 'next/navigation';
import LeadForm from '@/components/lead-form';
import { cache } from 'react';
import { UpdateLeadInput } from '@/lib/validators/lead';

interface PageProps {
  params: Promise<{ id: string }>;
}

const getLead = cache(async (id: string) => {
  const lead = await db.leads.findUnique({ where: { id } });

  if (!lead) notFound();

  return lead;
});

export default async function LeadPage({ params }: PageProps) {
  const { id } = await params;
  const lead: UpdateLeadInput = await getLead(id);

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
        <LeadForm initialData={lead} />
      </div>
    </div>
  );
}
