import { cache } from 'react';

import { UserProfileCard } from '@/components/profile/user-profile-card';
import { getLead } from '@/actions/leads';

const getCachedLeads = cache(async (id: string) => getLead(id));

import { Leads, Instruments, Sources, Stage } from '@prisma/client';
import { UserProfileData } from '@/app/types/user';
import { computeAlerts } from '@/lib/alerts';
import { notFound } from 'next/navigation';
import { getFullName, getInitials } from '@/lib/utils';

export function leadToProfileData(
  lead: Leads & {
    instruments: Instruments[];
    source: Sources | null;
    stage: Stage | null;
  },
): UserProfileData {
  const fullName = getFullName(lead);

  return {
    name: fullName,
    avatarUrl: undefined, // supply avatar if stored
    initials: getInitials(lead),
    info: [
      {
        label: 'Community/Area',
        value: lead.community ?? lead.area ?? '-',
      },
      {
        label: 'Stage',
        value: lead.stage?.name ?? '-',
      },
      {
        label: 'Expected Budget',
        value:
          lead.expected_budget > 0
            ? `₹${lead.expected_budget}`
            : 'Not specified',
      },
    ],
    phone: lead.phone,
    whatsapp: lead.phone,
    email: lead.email ?? undefined,
    tags: [...lead.instruments.map(i => i.name)],
    alerts: computeAlerts(lead),
  };
}

export default async function LeadsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await getCachedLeads(id);

  if (!lead) {
    return notFound();
  }

  const profileData = leadToProfileData(lead);

  return (
    <div className="grid grid-cols-2 gap-6 p-4">
      {/* dynamic notes/status column here */}
      <div />
      <UserProfileCard data={profileData} />
    </div>
  );
}
