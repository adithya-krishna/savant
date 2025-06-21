import { db } from '@/db';

export const getLead = async (id: string) =>
  await db.leads.findUnique({
    where: { id },
    include: {
      stage: true,
      instruments: true,
      source: true,
      team_member: true,
    },
  });
