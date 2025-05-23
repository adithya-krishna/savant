import { SidebarNav } from '@/components/sidebar-nav';
import { cache, ReactNode } from 'react';
import StudentFormDialog from '@/components/student-form-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getFullName, getInitials } from '@/lib/utils';
import { Phone, UserRoundPlus } from 'lucide-react';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import TextWithIcon from '@/components/text-with-icon';
import { Badge } from '@/components/ui/badge';

const items = [
  {
    title: 'Basic',
    href: '/lead/profile/[id]',
  },
  {
    title: 'Notes',
    href: '/lead/profile/[id]/notes',
  },
  {
    title: 'Follow up',
    href: '/lead/profile/[id]/follow-up',
  },
  {
    title: 'Students',
    href: '/lead/profile/[id]/students',
  },
  {
    title: 'Account',
    href: '/lead/profile/[id]/account',
  },
];

interface LeadProfileLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

export const getLeads = cache(async (id: string) => {
  const lead = await db.leads.findUnique({
    where: { id },
    include: {
      stage: { select: { name: true, color: true } },
    },
  });

  if (!lead) notFound();

  return lead;
});

const LeadProfileLayout = async ({
  children,
  params,
}: LeadProfileLayoutProps) => {
  const { id } = await params;
  const lead = await getLeads(id);

  let stageStyle;
  if (lead.stage?.color) {
    stageStyle = { borderColor: lead.stage.color, color: lead.stage.color };
  }

  const formattedItems = items.map(i => ({
    ...i,
    href: i.href.replace('[id]', id),
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-[12rem_auto] h-full">
      <SidebarNav items={formattedItems} />
      <main className="p-4 w-full max-w-6xl mx-auto">
        <div className="flex w-full px-2 mb-6 justify-between">
          <div className="flex space-x-4">
            <Avatar className="shrink-0 size-16">
              <AvatarFallback>{getInitials(lead)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex flex-row items-center w-full">
                <h2 className="text-2xl font-semibold">{getFullName(lead)}</h2>
                <Badge
                  style={stageStyle}
                  variant={'outline'}
                  className={`ml-4 max-h-fit`}
                >
                  {lead.stage?.name}
                </Badge>
              </div>
              <TextWithIcon
                iconSize={12}
                icon={Phone}
                label={lead?.phone ?? '-'}
              />
            </div>
          </div>
          <StudentFormDialog id={id}>
            <Button size="icon">
              <UserRoundPlus />
            </Button>
          </StudentFormDialog>
        </div>
        {children}
      </main>
    </div>
  );
};

export default LeadProfileLayout;
