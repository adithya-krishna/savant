import { Prisma } from '@prisma/client';

export type SectionTypes = 'team-member' | 'lead' | 'stage';

export type TeamMemberType = Prisma.TeamMemberGetPayload<{
  select: { id: true; first_name: true; last_name: true };
}>;

export type InstrumentType = Prisma.InstrumentsGetPayload<{
  select: { id: true; name: true; description: true };
}>;

export type LeadsWithInstruments = Prisma.LeadsGetPayload<{
  include: { instruments: { select: { id: true; name: true } } };
}>;

export type LeadsWithAllInclusions = Prisma.LeadsGetPayload<{
  include: {
    stage: true;
    team_member: { select: { id: true; first_name: true; last_name: true } };
    instruments: { select: { id: true; name: true } };
  };
}>;

export type StudentsGetType = Prisma.StudentGetPayload<object>;
