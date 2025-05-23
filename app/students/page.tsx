import React, { cache } from 'react';
import { db } from '@/db';
import { Button } from '@/components/ui/button';
import LeadFormDialog from '@/components/lead-form-dialog';
import { DataTable } from '@/components/data-tables';
import { columns } from './columns';

const getStudents = cache(async () => {
  const students = await db.student.findMany({
    orderBy: { create_date: 'desc' },
    // include: {},
  });

  return students;
});

export default async function StudentsPage() {
  const students = await getStudents();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Students</h1>
        <LeadFormDialog>
          <Button>Add Student</Button>
        </LeadFormDialog>
      </div>

      <DataTable data={students} columns={columns} />
    </div>
  );
}
