import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { getFullName } from '@/lib/utils';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { cache } from 'react';

interface LeadStudentsProps {
  params: Promise<{ id: string }>;
}

export const getLeadWithStudents = cache(async (id: string) => {
  const lead = await db.leads.findUnique({
    where: { id },
    include: {
      student: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          create_date: true,
        },
      },
    },
  });

  if (!lead) notFound();

  return lead;
});

const LeadStudents = async ({ params }: LeadStudentsProps) => {
  const { id } = await params;
  const lead = await getLeadWithStudents(id);

  return (
    <section className="mt-12 px-2">
      <h2 className="text-2xl font-semibold">Student profiles</h2>
      <Separator />

      <div className="mt-6 rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Created On</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {lead.student.map(s => (
              <TableRow key={s.id}>
                <TableCell className="w-full">{getFullName(s)}</TableCell>
                <TableCell className="space-x-2">
                  {format(s.create_date, 'do MMM')}
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
