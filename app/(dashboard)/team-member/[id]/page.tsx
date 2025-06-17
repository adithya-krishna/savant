import { db } from '@/db';
import { notFound } from 'next/navigation';
import TeamMemberForm from '@/components/team-member-form';
import { cache } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

const getAllCourses = cache(async () => {
  const courses = await db.course.findMany({
    select: { name: true, id: true },
  });
  return courses.map(c => ({ label: c.name, value: c.id }));
});

const getTeamMemberById = cache(async (id: string) => {
  const teamMember = await db.teamMember.findUnique({
    where: { id },
    include: { courses: { select: { id: true } } },
  });
  if (!teamMember) notFound();
  return teamMember;
});

export default async function TeamMemberPage({ params }: PageProps) {
  const { id } = await params;
  let teamMember = null;
  if (id !== 'new') {
    teamMember = await getTeamMemberById(id);
  }
  const allCourses = await getAllCourses();

  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      <div className="flex w-full flex-col p-4 md:w-72 md:shrink-0">
        <h1 className="mb-2 text-2xl font-semibold">
          {id === 'new' ? 'Add Team Member' : 'Edit Team Member'}
        </h1>
        <p className="text-sm text-gray-400">
          Update Team Member details, track changes to keep your pipeline
          accurate and current.
        </p>
      </div>
      <div className="flex h-full w-full md:h-auto p-4">
        <TeamMemberForm
          initialData={teamMember}
          allCourses={allCourses}
          id={id}
        />
      </div>
    </div>
  );
}
