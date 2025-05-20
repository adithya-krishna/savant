import React from 'react';
import { db } from '@/db';
import { Button } from '@/components/ui/button';
import LeadFormDialog from '@/components/lead-form-dialog';
import { DataTable } from '@/components/data-tables';
import { columns } from '@/app/leads/columns';

export default async function LeadsPage() {
  const leads = await db.leads.findMany({
    orderBy: { create_date: 'desc' },
    include: {
      stage: true,
      team_member: true,
      instruments: true,
      // source: true,
    },
  });
  const stages = await db.stage.findMany();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Leads</h1>
        <LeadFormDialog>
          <Button>Add Lead</Button>
        </LeadFormDialog>
      </div>

      <DataTable
        columns={columns}
        data={leads}
        filterOptions={{
          stages: stages.map(stage => ({ label: stage.name, value: stage.id })),
        }}
      />
    </div>
  );
}
