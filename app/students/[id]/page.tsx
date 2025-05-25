import { db } from '@/db';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import EnrollmentForm from '@/components/enrollment-form';

interface StudentProfileProps {
  params: Promise<{ id: string }>;
}

const getStudentProfile = cache(async (id: string) => {
  const student = await db.student.findUnique({ where: { id } });

  if (!student) notFound();

  return student;
});

const StudentProfile = async ({ params }: StudentProfileProps) => {
  const { id } = await params;
  const student = await getStudentProfile(id);

  return (
    <div className="flex flex-col w-full">
      <EnrollmentForm id={student.id} />
    </div>
  );
};

export default StudentProfile;
