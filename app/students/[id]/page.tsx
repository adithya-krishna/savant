import Stat from '@/components/stat';
import TextWithIcon from '@/components/text-with-icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { db } from '@/db';
import { calculateAge } from '@/lib/utils';
import { AtSign, CalendarClock, FileUser, MapPin } from 'lucide-react';
import { notFound } from 'next/navigation';
import { cache } from 'react';

interface StudentProfileProps {
  params: Promise<{ id: string }>;
}

const getStudentProfile = cache(async (id: string) => {
  const student = await db.student.findUnique({
    where: { id },
    include: {
      enrollments: {
        include: {
          course: {
            include: {
              instrument: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!student) notFound();

  const age = calculateAge(student.dob);

  const totalEnrollments = String(student.enrollments.length);
  const coursesEnrolled = student.enrollments
    .map(e => e.course.instrument?.name ?? '')
    .join(', ');

  return { ...student, age, totalEnrollments, coursesEnrolled };
});

const StudentProfile = async ({ params }: StudentProfileProps) => {
  const { id } = await params;
  const student = await getStudentProfile(id);
  const { age, totalEnrollments, coursesEnrolled } = student;

  return (
    <>
      <section className="mt-12 px-2">
        <h2 className="text-2xl font-semibold">Profile information</h2>
        <Separator />

        <div className="mt-6">
          <div className="grid grid-cols-2 text-sm/6 text-foreground space-y-6">
            <TextWithIcon icon={AtSign} label={'Email'} />
            <p className="truncate text-right">{student.email ?? '-'}</p>
            <TextWithIcon icon={MapPin} label={'Full Address'} />
            <p className="text-right">{student.address ?? '-'}</p>
            <TextWithIcon icon={CalendarClock} label={'Age'} />
            <p className="text-right">{age}</p>
          </div>
        </div>
      </section>
      <section className="flex flex-wrap gap-4 mt-12 px-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 text-sm font-medium w-56">
            <CardTitle>Enrollments</CardTitle>
            <FileUser size={14} />
          </CardHeader>
          <CardContent>
            <Stat title={totalEnrollments} subtitle={coursesEnrolled} />
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default StudentProfile;
