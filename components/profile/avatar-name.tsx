'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AvatarNameProps {
  name: string;
  initials: string;
  avatarUrl?: string;
}

export function AvatarName({ name, initials, avatarUrl }: AvatarNameProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <h2 className="text-xl font-semibold">{name}</h2>
    </div>
  );
}
