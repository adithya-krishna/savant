import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { getFullName, priceFromInt } from '@/lib/utils';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { cache } from 'react';

interface StudentEnrollmentsProps {
  params: Promise<{ id: string }>;
}

const getStudentProfile = cache(async (id: string) => {
  const enrollments = await db.student.findUnique({
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

  if (!enrollments) notFound();

  return enrollments;
});

const LeadStudents = async ({ params }: StudentEnrollmentsProps) => {
  const { id } = await params;
  const student = await getStudentProfile(id);

  return (
    <section className="mt-12 px-2">
      <h2 className="text-2xl font-semibold">Enrollments</h2>
      <Separator />

      <div className="mt-6 rounded-md border">
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
                <TableCell className="w-full">{e.course.name}</TableCell>
                <TableCell className="w-full">{e.plan_name.name}</TableCell>
                <TableCell className="w-full">{e.status}</TableCell>
                <TableCell className="w-full">
                  {priceFromInt(e.plan_name.price)}
                </TableCell>
                <TableCell className="w-full">
                  {format(e.start_date, 'do MMM')}
                </TableCell>
                <TableCell className="space-x-2">
                  {format(e.create_date, 'do MMM')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default LeadStudents;
