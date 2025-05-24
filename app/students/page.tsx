import React, { cache } from 'react';
import { db } from '@/db';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-tables';
import { columns } from './columns';
import StudentFormDialog from '@/components/student-form-dialog';

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
        <StudentFormDialog id={'new'}>
          <Button>Add Student</Button>
        </StudentFormDialog>
      </div>

      <DataTable data={students} columns={columns} />
    </div>
  );
}
