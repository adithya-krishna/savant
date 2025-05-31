import React, { cache } from 'react';
import { db } from '@/db';
import { Button } from '@/components/ui/button';
import LeadFormDialog from '@/components/lead-form-dialog';
import { DataTable } from '@/components/data-tables';
import { getFullName } from '@/lib/utils';
import { columns } from './columns';

const getLeadsWithFilters = cache(async () => {
  return await db.leads.findMany({
    orderBy: { create_date: 'desc' },
    include: {
      stage: true,
      team_member: { select: { id: true, first_name: true, last_name: true } },
      instruments: { select: { id: true, name: true } },
      // source: true,
    },
  });
});

const getFilterOptions = cache(async () => {
  const stages = await db.stage.findMany({ select: { id: true, name: true } });
  const instruments = await db.instruments.findMany({
    select: { id: true, name: true },
  });
  const teamMembers = await db.teamMember.findMany({
    select: { id: true, first_name: true, last_name: true },
  });

  const filterOptions = {
    stages: stages.map(s => ({ label: s.name, value: s.id })),
    instruments: instruments.map(i => ({ label: i.name, value: i.id })),
    teamMembers: teamMembers.map(t => ({
      label: getFullName(t),
      value: t.id,
    })),
  };

  return filterOptions;
});

export default async function LeadsPage() {
  const leads = await getLeadsWithFilters();
  const filterOptions = await getFilterOptions();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Leads</h1>
        <LeadFormDialog>
          <Button>Add Lead</Button>
        </LeadFormDialog>
      </div>

      <DataTable columns={columns} data={leads} filterOptions={filterOptions} />
    </div>
  );
}
