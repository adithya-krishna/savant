import StudentFormDialog from '@/components/student-form-dialog';
import TextWithIcon from '@/components/text-with-icon';
import { AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { db } from '@/db';
import { getFullName, getInitials } from '@/lib/utils';
import { Avatar } from '@radix-ui/react-avatar';
import { AtSign, MapPin, Phone, Piano, UserRoundPlus } from 'lucide-react';
import { notFound } from 'next/navigation';
import { cache } from 'react';

interface LeadProfileProps {
  params: Promise<{ id: string }>;
}

const items = [
  {
    title: 'Home',
    url: '#',
  },
  {
    title: 'Inbox',
    url: '#',
  },
  {
    title: 'Calendar',
    url: '#',
  },
  {
    title: 'Search',
    url: '#',
  },
  {
    title: 'Settings',
    url: '#',
  },
];

export const getLeadsWithInstruments = cache(async (id: string) => {
  const lead = await db.leads.findUnique({
    where: { id },
    include: { instruments: { select: { id: true, name: true } } },
  });

  if (!lead) notFound();
  return lead;
});

const LeadProfile = async ({ params }: LeadProfileProps) => {
  const { id } = await params;
  const lead = await getLeadsWithInstruments(id);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[16rem_auto] h-full">
      <Sidebar
        collapsible="none"
        className="border-r border-l bg-background hidden md:flex"
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <div className="p-4">
        <Card className="max-w-lg bg-background">
          <CardContent>
            <div className="flex space-x-4">
              <Avatar className="shrink-0 size-16">
                <AvatarFallback>{getInitials(lead)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col grow-0">
                <h2 className="text-2xl font-semibold">{getFullName(lead)}</h2>
                <TextWithIcon
                  iconSize={12}
                  icon={Phone}
                  label={lead?.phone ?? '-'}
                />
              </div>
            </div>
          </CardContent>
          <CardContent className="grid grid-cols-2 text-sm/6 text-muted-foreground space-y-1.5">
            <TextWithIcon icon={AtSign} label={'Email'} />
            <p className="truncate">{lead?.email}</p>
            <TextWithIcon icon={MapPin} label={'Address'} />
            <span>{lead?.address}</span>
            <TextWithIcon icon={Piano} label={'Instruments'} />
            <div className="flex flex-wrap gap-1">
              {lead?.instruments.map(instrument => (
                <Badge key={instrument.id}>{instrument.name}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <StudentFormDialog>
          <Button size="icon">
            <UserRoundPlus />
          </Button>
        </StudentFormDialog>
      </div>
    </div>
  );
};

export default LeadProfile;
