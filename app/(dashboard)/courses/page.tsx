import { db } from '@/db';
import { CourseForm } from '@/components/course-form';
import { Button } from '@/components/ui/button';
import { cache } from 'react';
import { getFullName } from '@/lib/utils';
import EnrolmentsTable from './client';
import { TeamMemberRole } from '@/lib/enums';

const getCourses = cache(
  async () =>
    await db.course.findMany({
      include: {
        teachers: { select: { id: true, first_name: true, last_name: true } },
        instrument: { select: { id: true, name: true } },
      },
    }),
);

const getFilterOptions = cache(async () => {
  const instruments = await db.instruments.findMany({
    select: { id: true, name: true },
  });
  const teamMembers = await db.teamMember.findMany({
    where: { role: TeamMemberRole.INSTRUCTOR },
    select: { id: true, first_name: true, last_name: true },
  });

  const filterOptions = {
    instruments: instruments.map(i => ({ label: i.name, value: i.id })),
    teamMembers: teamMembers.map(t => ({
      label: getFullName(t),
      value: t.id,
    })),
  };

  return filterOptions;
});

export default async function EnrollmentsPage() {
  const courses = await getCourses();
  const filterOptions = await getFilterOptions();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Courses</h1>
        <CourseForm>
          <Button>Add Course</Button>
        </CourseForm>
      </div>

      <EnrolmentsTable courses={courses} filterOptions={filterOptions} />
    </div>
  );
}
