'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { UserProfileData } from '@/app/types/user';

import { AvatarName } from './avatar-name';
import { InfoTable } from './info-table';
import { ContactInfo } from './contact-info';
import { TagsList } from './tags-list';
import { AlertsList } from './alerts-list';
import { cn } from '@/lib/utils';

interface UserProfileCardProps {
  data: UserProfileData;
  className?: string;
}

export function UserProfileCard({ data, className }: UserProfileCardProps) {
  const { name, avatarUrl, info, phone, whatsapp, email, tags, alerts } = data;

  return (
    <Card
      className={cn(
        'flex flex-col gap-6 sticky top-0 max-h-screen overflow-y-auto p-2 max-w-sm',
        className,
      )}
    >
      <CardHeader className="items-center pb-6">
        <AvatarName name={name} avatarUrl={avatarUrl} />
      </CardHeader>

      <CardContent className="space-y-6">
        <InfoTable data={info} />

        <ContactInfo phone={phone} whatsapp={whatsapp} email={email} />

        <TagsList tags={tags} />

        <AlertsList alerts={alerts} />
      </CardContent>
    </Card>
  );
}
