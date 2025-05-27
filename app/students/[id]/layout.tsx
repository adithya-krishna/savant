import { SidebarNav } from '@/components/sidebar-nav';
import { cache, ReactNode } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getFullName, getInitials } from '@/lib/utils';
import { Phone, UserRoundPlus } from 'lucide-react';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import TextWithIcon from '@/components/text-with-icon';
import EnrollmentForm from '@/components/enrollment-form';

const items = [
  {
    title: 'Basic',
    href: '/student/[id]',
  },
  {
    title: 'Account',
    href: '/student/[id]/account',
  },
];

interface StudentProfileLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

const getStudentProfile = cache(async (id: string) => {
  const student = await db.student.findUnique({ where: { id } });

  if (!student) notFound();

  return student;
});

const StudentProfileLayout = async ({
  children,
  params,
}: StudentProfileLayoutProps) => {
  const { id } = await params;
  const student = await getStudentProfile(id);

  const formattedItems = items.map(i => ({
    ...i,
    href: i.href.replace('[id]', id),
  }));

  const studentName = getFullName(student);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[12rem_auto] h-full">
      <SidebarNav items={formattedItems} />
      <main className="p-4 w-full max-w-6xl mx-auto">
        <div className="flex w-full px-2 mb-6 justify-between">
          <div className="flex space-x-4">
            <Avatar className="shrink-0 size-16">
              <AvatarFallback>{getInitials(student)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex flex-row items-center w-full">
                <h2 className="text-2xl font-semibold">{studentName}</h2>
              </div>
              <TextWithIcon
                iconSize={12}
                icon={Phone}
                label={student?.primary_contact ?? '-'}
              />
            </div>
          </div>
          <EnrollmentForm id={id} studentName={studentName}>
            <Button size="icon">
              <UserRoundPlus />
            </Button>
          </EnrollmentForm>
        </div>
        {children}
      </main>
    </div>
  );
};

export default StudentProfileLayout;
