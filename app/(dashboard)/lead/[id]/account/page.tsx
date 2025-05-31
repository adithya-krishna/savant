import { db } from '@/db';
import { notFound } from 'next/navigation';
import LeadForm from '@/components/lead-form';
import { cache } from 'react';
import { Separator } from '@/components/ui/separator';

interface PageProps {
  params: Promise<{ id: string }>;
}

const getLead = cache(async (id: string) => {
  const lead = await db.leads.findUnique({ where: { id } });

  if (!lead) notFound();

  return { ...lead, expected_budget: lead.expected_budget.toString() };
});

export default async function LeadPage({ params }: PageProps) {
  const { id } = await params;
  const lead = await getLead(id);

  return (
    <section className="mt-12 px-2">
      <h2 className="text-2xl font-semibold">Edit Lead</h2>
      <p className="text-sm text-gray-400">
        Update lead details, assign team members, and track changes to keep your
        pipeline accurate and current.
      </p>
      <Separator />
      <div className="flex h-full w-full md:h-auto">
        <LeadForm initialData={lead} />
      </div>
    </section>
  );
}
