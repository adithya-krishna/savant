import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { priceFromInt } from '@/lib/utils';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { cache } from 'react';

interface StudentEnrollmentsProps {
  params: Promise<{ id: string }>;
}

const getStudentProfile = cache(async (id: string) => {
  const student = await db.student.findUnique({
    where: { id },
    include: {
      enrollments: {
        include: {
          course: {
            select: { id: true, name: true },
          },
          plan_name: {
            select: { code: true, name: true, price: true },
          },
        },
      },
    },
  });

  if (!student) notFound();

  return student;
});

const LeadStudents = async ({ params }: StudentEnrollmentsProps) => {
  const { id } = await params;
  const student = await getStudentProfile(id);

  return (
    <section className="mt-12 px-2">
      <h2 className="text-2xl font-semibold">Enrollments</h2>
      <Separator />

      <div className="mt-6 rounded-md border bg-card shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Starts On</TableHead>
              <TableHead>Created On</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {student.enrollments.map(e => (
              <TableRow key={e.id}>
                <TableCell>{e.course.name}</TableCell>
                <TableCell>{e.plan_name.name}</TableCell>
                <TableCell>{e.status}</TableCell>
                <TableCell>{priceFromInt(e.plan_name.price)}</TableCell>
                <TableCell>{format(e.start_date, 'do MMM')}</TableCell>
                <TableCell>{format(e.create_date, 'do MMM')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default LeadStudents;
