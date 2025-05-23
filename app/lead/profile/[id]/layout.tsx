import { SidebarNav } from '@/components/sidebar-nav';
import { ReactNode } from 'react';

const items = [
  {
    title: 'Basic',
    href: '#',
  },
  {
    title: 'Notes',
    href: '#',
  },
  {
    title: 'Follow up',
    href: '#',
  },
  {
    title: 'Students',
    href: '#',
  },
  {
    title: 'Account',
    href: '#',
  },
];

interface LeadProfileLayoutProps {
  children: ReactNode;
}

const LeadProfileLayout = async ({ children }: LeadProfileLayoutProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[12rem_auto] h-full">
      <SidebarNav items={items} />
      <main className="p-4">{children}</main>
    </div>
  );
};

export default LeadProfileLayout;
