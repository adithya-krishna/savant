import { SidebarNav } from '@/components/sidebar-nav';
import { ReactNode } from 'react';

const items = [
  {
    title: 'Basic',
    href: '/students/[id]',
  },
  {
    title: 'Enrollments',
    href: '/students/[id]/enrollments',
  },
  {
    title: 'Account',
    href: '/students/[id]/account',
  },
];

interface StudentProfileLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

const StudentProfileLayout = async ({
  children,
  params,
}: StudentProfileLayoutProps) => {
  const { id } = await params;
  const formattedItems = items.map(i => ({
    ...i,
    href: i.href.replace('[id]', id),
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-[12rem_auto]">
      <SidebarNav items={formattedItems} />
      <main className="p-4 w-full max-w-6xl mx-auto">{children}</main>
    </div>
  );
};

export default StudentProfileLayout;
