import React from 'react';
import SlotItem from './SlotItem';

interface SlotPageProps {
  params: Promise<{ date: string }>;
}

async function SlotsPage({ params }: SlotPageProps) {
  const { date } = await params;
  return (
    <section className="w-full my-4">
      <p>{date}</p>
      <h1 className="text-2xl font-bold mb-4">Guitar</h1>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SlotItem
            key={`slotItem-${i}`}
            time={'3:00 - 4:00'}
            count={Math.floor(Math.random() * 12)}
            maxCap={12}
          />
        ))}
      </div>
    </section>
  );
}

export default SlotsPage;
