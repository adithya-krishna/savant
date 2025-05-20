import { Prisma } from '@prisma/client';

export type SectionTypes = 'team-member' | 'lead' | 'stage';

export type TeamMemberType = Prisma.TeamMemberGetPayload<{
  select: { id: true; first_name: true; last_name: true };
}>;

export type InstrumentType = Prisma.InstrumentsGetPayload<{
  select: { id: true; name: true; description: true };
}>;
