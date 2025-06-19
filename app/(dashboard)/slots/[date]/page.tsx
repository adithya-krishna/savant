import React, { cache } from 'react';
import SlotItem from './SlotItem';
import { getSlotsByCourseId } from '@/actions/slots';
import { db } from '@/db';

interface SlotPageProps {
  params: Promise<{ date: string }>;
}

const humanRange = (startIso: string, endIso: string) => {
  const start = new Date(startIso);
  const end = new Date(endIso);
  return `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString(
    [],
    { hour: '2-digit', minute: '2-digit' },
  )}`;
};

const getSlotsForDate = cache(async (date: string) => {
  const eventsByCourse = await getSlotsByCourseId(date);

  const courseIds = Object.keys(eventsByCourse);
  const courses =
    courseIds.length === 0
      ? []
      : await db.course.findMany({
          where: { id: { in: courseIds } },
          select: { id: true, name: true },
        });

  const courseNameMap = Object.fromEntries(
    courses.map(({ id, name }) => [id, name]),
  ) as Record<string, string>;

  return { eventsByCourse, courseNameMap };
});

async function SlotsPage({ params }: SlotPageProps) {
  const { date } = await params;
  const { eventsByCourse, courseNameMap } = await getSlotsForDate(date);
  const courseIds = Object.keys(eventsByCourse);

  return (
    <section className="w-full my-4">
      {courseIds.map(courseId => {
        const slots = eventsByCourse[courseId];

        return (
          <div key={courseId} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {courseNameMap[courseId] ?? courseId}
            </h2>

            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              {slots.map(ev => (
                <SlotItem
                  key={ev.id}
                  time={humanRange(ev.start_date_time, ev.end_date_time)}
                  count={ev.guests.length}
                  maxCap={8}
                />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default SlotsPage;
