import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  CalendarClock,
  ClipboardList,
  HelpCircleIcon,
  Home,
  Rocket,
  SettingsIcon,
  UserRound,
  UsersIcon,
} from 'lucide-react';
import Link from 'next/link';
import NavMain from './nav-main';
import { NavSecondary } from './nav-secondary';
import { ComponentProps } from 'react';

const navMain = [
  {
    title: 'Leads',
    href: '/leads',
    icon: Rocket,
  },
  {
    title: 'Team',
    href: '/team-members',
    icon: UsersIcon,
  },
  {
    title: 'Students',
    href: '/students',
    icon: UserRound,
  },
  {
    title: 'Slots',
    href: '/slots',
    icon: CalendarClock,
  },
  {
    title: 'Enrollments',
    href: '/enrollments',
    icon: ClipboardList,
  },
];

const navSecondary = [
  {
    title: 'Settings',
    href: '/settings',
    icon: SettingsIcon,
  },
  {
    title: 'Get Help',
    href: '/help',
    icon: HelpCircleIcon,
  },
];

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <Home className="h-5 w-5" />
                <span className="text-base font-semibold">Dash</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
