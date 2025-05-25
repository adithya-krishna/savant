'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { getTimeSlots, getWeekDays } from '@/lib/utils';
import { TimeSlotSelection } from '@/app/global-types';
import { Dispatch, SetStateAction } from 'react';

const days = getWeekDays({ weekStartOn: 1, filter: ['Monday'] });
const timeSlots = getTimeSlots({ intervalMinutes: 60 });
const defaultSelected = '' + days[0].id;

interface PreferredSlotSelectProps {
  selectedSlots: TimeSlotSelection;
  setSlots: Dispatch<SetStateAction<TimeSlotSelection>>;
}

export default function PreferredSlotSelect({
  selectedSlots,
  setSlots,
}: PreferredSlotSelectProps) {
  const handleDaySelect = (dayId: number) => {
    if (!selectedSlots[dayId]) {
      setSlots(prev => ({
        ...prev,
        [dayId]: [],
      }));
    }
  };

  const handleTimeSlotToggle = (dayId: number, slotId: string) => {
    setSlots(prev => {
      const currentDaySlots = prev[dayId] || [];

      const newDaySlots = currentDaySlots.includes(slotId)
        ? currentDaySlots.filter(id => id !== slotId)
        : [...currentDaySlots, slotId];

      return {
        ...prev,
        [dayId]: newDaySlots,
      };
    });
  };

  return (
    <div className="w-full">
      <p className="text-sm font-medium leading-none mb-2">
        Select preffered time slots.
      </p>
      <Tabs defaultValue={defaultSelected} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          {days.map(day => (
            <TabsTrigger
              key={day.id}
              value={day.id.toString()}
              onClick={() => handleDaySelect(day.id)}
              className="flex flex-col items-center justify-center relative"
            >
              <div className="flex items-center">
                {selectedSlots[day.id]?.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                )}
                <span>{day.label}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {days.map(day => (
          <TabsContent key={day.id} value={day.id.toString()} className="mt-3">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {timeSlots.map(slot => (
                <Button
                  key={slot.id}
                  variant={
                    selectedSlots[day.id]?.includes(slot.id)
                      ? 'default'
                      : 'ghost'
                  }
                  type="button"
                  onClick={() => handleTimeSlotToggle(day.id, slot.id)}
                  className="h-10"
                >
                  {slot.label}
                </Button>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
