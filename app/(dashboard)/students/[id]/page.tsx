import EnrollmentForm from '@/components/enrollment-form';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { db } from '@/db';
import { calculateAge, getFullName, getInitials } from '@/lib/utils';
import { CalendarClock, ClipboardPenLine, UserRoundPlus } from 'lucide-react';
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
        where: { is_deleted: false },
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

  const coursesEnrolled = student.enrollments
    .map(e => e.course.instrument?.name ?? '')
    .join(', ');

  const slotsRemaining = student.enrollments.reduce(
    (sum, e) => sum + e.slots_remaining,
    0,
  );

  return { ...student, age, coursesEnrolled, slotsRemaining };
});

function Info({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h4 className="text-muted-foreground text-sm font-semibold">{title}</h4>
      <p className="text-sm max-w-sm">{value}</p>
    </div>
  );
}

const StudentProfile = async ({ params }: StudentProfileProps) => {
  const { id } = await params;
  const student = await getStudentProfile(id);
  const { age, coursesEnrolled, slotsRemaining } = student;
  const studentName = getFullName(student);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-medium">Student Details</CardTitle>
          {/* <CardDescription>This is the CardDescription</CardDescription> */}
          <CardAction>
            <EnrollmentForm id={id} studentName={studentName}>
              <Button variant="outline" size="sm">
                <>
                  <UserRoundPlus className="size-3.5" />
                  <span className="text-xs">Enroll</span>
                </>
              </Button>
            </EnrollmentForm>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3 md:gap-9 items-start md:items-center">
            <Avatar className="shrink-0 size-20 self-center">
              <AvatarFallback>{getInitials(student)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold">{studentName}</h2>
              <div className="flex flex-col md:flex-row justify-start gap-3 md:gap-9">
                <Info title={'Phone'} value={student.primary_contact ?? '-'} />
                <Info title={'Email'} value={student.email ?? '-'} />
                <Info title={'Age'} value={age} />
                <Info title={'Address'} value={student.address ?? '-'} />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-4 flex-wrap">
          <div className="flex rounded-md border p-3 gap-4 items-center">
            <div className="flex items-center justify-center size-12 bg-accent rounded-full">
              <ClipboardPenLine size={18} />
            </div>
            <div className="flex flex-col">
              <h4 className="text-muted-foreground text-sm">Enrollments</h4>
              <p className="font-semibold">{coursesEnrolled}</p>
            </div>
          </div>
          <div className="flex rounded-md border p-3 gap-4 items-center">
            <div className="flex items-center justify-center size-12 bg-accent rounded-full">
              <CalendarClock size={18} />
            </div>
            <div className="flex flex-col">
              <h4 className="text-muted-foreground text-sm">Slots Remaining</h4>
              <p className="font-semibold">{slotsRemaining}</p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default StudentProfile;
