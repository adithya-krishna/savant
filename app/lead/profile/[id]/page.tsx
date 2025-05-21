import TextWithIcon from '@/components/text-with-icon';
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
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
import { AtSign, MapPinHouse, Phone } from 'lucide-react';

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

const LeadProfile = async ({ params }: LeadProfileProps) => {
  const { id } = await params;
  const lead = await db.leads.findUnique({
    where: { id },
    include: { instruments: { select: { id: true, name: true } } },
  });

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
              <Avatar className="shrink-0 w-16 h-16">
                <AvatarFallback>{getInitials(lead)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col grow-0">
                <h2 className="text-2xl font-semibold">{getFullName(lead)}</h2>
                <div>
                  <TextWithIcon icon={Phone} label={lead?.phone ?? '-'} />
                  <TextWithIcon icon={AtSign} label={lead?.email ?? '-'} />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="gap-1.5 flex-wrap">
            {lead?.instruments.map(instrument => (
              <Badge key={instrument.id}>{instrument.name}</Badge>
            ))}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LeadProfile;
