'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { PropsBase } from 'react-day-picker';
import { format } from 'date-fns';
import { parseDate } from 'chrono-node';

function formatDate(date?: Date): string {
  return date ? format(date, 'dd/MM/yyyy') : '';
}

interface CalendarInputProps {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  disabled: PropsBase['disabled'];
}

export function CalendarInput({
  selected,
  onSelect,
  disabled,
}: CalendarInputProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(formatDate(selected));
  const [month, setMonth] = React.useState(selected);

  React.useEffect(() => {
    setMonth(selected);
  }, [selected]);

  const handleSelect = (d: Date | undefined) => {
    setValue(formatDate(d));
    setOpen(false);
    onSelect?.(d);
  };

  return (
    <div className="relative flex gap-2">
      <Input
        value={value}
        placeholder="01/01/1970"
        className="bg-background"
        onChange={e => {
          setValue(e.target.value);
          const date = parseDate(e.target.value);
          if (date) {
            onSelect?.(date);
          }
        }}
        onKeyDown={e => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setOpen(true);
          }
        }}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date-picker"
            variant="ghost"
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
          >
            <CalendarIcon className="size-3.5" />
            <span className="sr-only">Select date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <Calendar
            mode="single"
            selected={selected}
            captionLayout="dropdown"
            onSelect={handleSelect}
            month={month}
            onMonthChange={setMonth}
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
