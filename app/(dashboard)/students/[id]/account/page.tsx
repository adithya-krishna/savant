import StudentForm from '@/components/student-form';
import { Separator } from '@/components/ui/separator';
import { db } from '@/db';
import { notFound } from 'next/navigation';
import { cache } from 'react';

interface StudentAccountProps {
  params: Promise<{ id: string }>;
}

const getStudentProfile = cache(async (id: string) => {
  const student = await db.student.findUnique({
    where: { id },
  });

  if (!student) notFound();

  return student;
});

export default async function StudentPage({ params }: StudentAccountProps) {
  const { id } = await params;
  const student = await getStudentProfile(id);

  return (
    <section className="mt-12 px-2">
      <h2 className="text-2xl font-semibold">Edit Student</h2>
      <p className="text-sm text-gray-400">
        Update student details, assign team members, and track changes to keep
        your pipeline accurate and current.
      </p>
      <Separator />
      <div className="flex h-full w-full md:h-auto mt-6">
        <StudentForm initialData={student} />
      </div>
    </section>
  );
}
