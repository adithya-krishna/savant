'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { startOfWeek, addDays, format, isSameDay } from 'date-fns';
import Link from 'next/link';

interface WeekPickerProps {
  currentDate: Date;
  highlightDate?: Date;
  filterDays?: number[];
}

export default function WeekPicker({
  currentDate,
  highlightDate = new Date(),
  filterDays = [],
}: WeekPickerProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  return (
    <div className="grid grid-cols-7 gap-2">
      {days
        .filter(day => !filterDays.includes(day.getDay()))
        .map(day => {
          const dayStr = format(day, 'yyyy-MM-dd');
          const isActive = isSameDay(day, highlightDate);

          return (
            <Button
              key={dayStr}
              variant={isActive ? 'default' : 'ghost'}
              className={cn(
                'cursor-pointer flex flex-col h-auto py-1.5 px-3',
                isActive ? 'font-semibold' : 'font-thin',
              )}
              aria-current={isActive ? 'date' : undefined}
              asChild
            >
              <Link href={`/slots/${dayStr}`}>
                <p>{format(day, 'EEEEEE')}</p>
                <p>{format(day, 'dd')}</p>
              </Link>
            </Button>
          );
        })}
    </div>
  );
}
