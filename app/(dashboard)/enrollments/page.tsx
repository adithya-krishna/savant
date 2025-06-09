import { DataTable } from '@/components/data-tables';
import { db } from '@/db';
import { columns } from './columns';
import { cache } from 'react';

const getEnrollments = cache(async () => {
  return await db.enrollment.findMany({
    where: { is_deleted: false },
    orderBy: { create_date: 'desc' },
    include: {
      student: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
        },
      },
    },
  });
});

export default async function EnrollmentsPage() {
  const enrollments = await getEnrollments();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Enrollments</h1>
      </div>

      <DataTable data={enrollments} columns={columns} />
    </div>
  );
}
