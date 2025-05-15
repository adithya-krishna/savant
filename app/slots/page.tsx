"use client";

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, addDays, eachDayOfInterval, set } from "date-fns";
import { cn } from "@/lib/utils";
import { Minus } from "lucide-react";

export default function Page() {
  // Selected date state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // Appointment window state (editable)
  const [startTime, setStartTime] = useState<string>("15:00");
  const [endTime, setEndTime] = useState<string>("21:00");

  // Derive hours and minutes from time inputs
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  // Number of 1-hour slots
  const totalSlots =
    (endHour * 60 + endMinute - (startHour * 60 + startMinute)) / 60;

  // Next 7 days starting from selectedDate
  const days = eachDayOfInterval({
    start: selectedDate,
    end: addDays(selectedDate, 6),
  });

  // Browser timezone + offset
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const offsetMin = -new Date().getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const absMin = Math.abs(offsetMin);
  const offH = Math.floor(absMin / 60);
  const offM = absMin % 60;
  const formattedOffset = `GMT${sign}${String(offH).padStart(2, "0")}:${String(
    offM
  ).padStart(2, "0")}`;

  return (
    <div className="flex space-x-8 p-6">
      {/* Calendar */}
      <div className="flex flex-col gap-2">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-2" htmlFor="start-time">
              Start Time
            </Label>
            <Input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-2" htmlFor="end-time">
              End Time
            </Label>
            <Input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
        <div className="text-sm text-gray-600">
          ({formattedOffset}) {tz}
        </div>
      </div>

      <div className="flex-1">
        <div className="grid grid-cols-7 gap-4 place-items-center">
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className={
                "flex flex-col h-16 w-16 justify-center items-center rounded-full"
              }
            >
              <div className="text-xs">{format(day, "EEE").toUpperCase()}</div>
              <div className={"text-2xl font-semibold"}>{format(day, "d")}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-4 mt-4 place-items-center">
          {Array.from({ length: totalSlots }).map((_, rowIndex) =>
            days.map((day) => {
              const slot = set(day, {
                hours: startHour + rowIndex,
                minutes: startMinute,
                seconds: 0,
                milliseconds: 0,
              });

              // ignore modays
              if (day.getDay() === 1) {
                return <Minus key={`${day.toDateString()}_${rowIndex}`} />;
              }

              return (
                <Button
                  key={`${day.toDateString()}_${rowIndex}`}
                  variant="outline"
                  className="w-full"
                >
                  {format(slot, "h:mma")}
                </Button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
