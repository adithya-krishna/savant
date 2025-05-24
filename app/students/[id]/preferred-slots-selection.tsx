'use client';

import { Button } from '@/components/ui/button';
import { getTimeSlots, getWeekDays } from '@/lib/utils';
import { Fragment, useCallback, useState } from 'react';

function PreferredSlotSelection() {
  const days = getWeekDays({ weekStartOn: 1, filter: ['Monday'] });
  const timeSlots = getTimeSlots({ intervalMinutes: 60 });

  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<
    Record<number, string[]>
  >({});

  const toggleDays = useCallback((id: number) => {
    setSelectedDays(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(itemId => itemId !== id)
        : [...prevSelected, id],
    );
  }, []);

  const toggleTime = useCallback((id: number, timeLabel: string) => {
    setSelectedTimeSlots(prev => {
      const current = prev[id] || [];
      const updated = current.includes(timeLabel)
        ? current.filter(t => t !== timeLabel)
        : [...current, timeLabel];

      return { ...prev, [id]: updated };
    });
  }, []);

  /**
   * Preferred Time Slots
    Select your available days and times:

    Pick Days → Click the day buttons (Mon-Sun)

    Choose Times → Select slots under each day

    ✓ = Selected

    Gray = Day not chosen
   */

  return (
    <div className="max-w-2xl overflow-x-auto">
      <div className="grid grid-cols-7 gap-2 min-w-xl">
        <div className="col-span-1"></div>
        {days.map(day => (
          <Button
            key={`day-${day.id}`}
            onClick={() => toggleDays(day.id)}
            variant={`${selectedDays.includes(day.id) ? 'default' : 'outline'}`}
            className="h-10"
          >
            {day.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 min-w-xl mt-2">
        {timeSlots.map(timeSlot => (
          <Fragment key={`timeslot-${timeSlot.id}`}>
            <div className="col-span-1 flex items-center justify-end pr-2 text-sm text-muted-foreground">
              {timeSlot.label}
            </div>

            {days.map(day => {
              const isDaySelected = selectedDays.includes(day.id);
              const isTimeSelected = selectedTimeSlots[day.id]?.includes(
                timeSlot.id,
              );

              return (
                <Button
                  key={`slot-${day.id}-${timeSlot.id}`}
                  onClick={() => toggleTime(day.id, timeSlot.id)}
                  variant={
                    isTimeSelected
                      ? 'default'
                      : isDaySelected
                        ? 'secondary'
                        : 'outline'
                  }
                  disabled={!isDaySelected}
                  className={`h-10 ${!isDaySelected ? 'opacity-50' : ''}`}
                >
                  {isTimeSelected ? '✓' : ''}
                </Button>
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default PreferredSlotSelection;
