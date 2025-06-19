'use server';

import { ModifiedEventType } from '@/app/global-types';
import { db } from '@/db';
import { toZonedISOString } from '@/lib/utils/api-utils';
import { addDays } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';

export async function getSlotsByCourseId(date: string) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const start = fromZonedTime(`${date}T00:00:00`, timeZone);
  const end = addDays(start, 1);

  const events = await db.event.findMany({
    where: {
      start_date_time: { gte: start, lt: end },
    },
    include: {
      host: { select: { id: true, first_name: true, last_name: true } },
      guests: {
        include: {
          student: { select: { id: true, first_name: true, last_name: true } },
          course: {
            select: {
              id: true,
              name: true,
              difficulty: true,
              instrument: { select: { name: true } },
            },
          },
        },
      },
    },
    orderBy: { start_date_time: 'asc' },
  });

  const eventsWithLocalTimes = events.map(ev => ({
    ...ev,
    start_date_time: toZonedISOString(ev.start_date_time, timeZone),
    end_date_time: toZonedISOString(ev.end_date_time, timeZone),
  }));

  type Bucket = Record<string, ModifiedEventType[]>;
  const buckets: Bucket = {};

  for (const ev of eventsWithLocalTimes) {
    const courseIds = Array.from(new Set(ev.guests.map(g => g.course.id)));

    for (const cid of courseIds) {
      if (!buckets[cid]) buckets[cid] = [];
      buckets[cid].push(ev);
    }
  }

  return buckets;
}
