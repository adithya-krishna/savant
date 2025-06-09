import { addDays, format, isValid, parse } from 'date-fns';
import { redirect } from 'next/navigation';
import NavButtons from './NavButtons';
import WeekPicker from './WeekPicker';
import { ReactNode } from 'react';

const filterDays = [1];

interface SlotLayoutProps {
  params: Promise<{ date: string }>;
  children: ReactNode;
}

export default async function Slots({ params, children }: SlotLayoutProps) {
  const { date } = await params;

  const selectedDate = parse(date, 'yyyy-MM-dd', new Date());
  const isValidDate =
    isValid(selectedDate) && format(selectedDate, 'yyyy-MM-dd') === date;

  if (!isValidDate) {
    const today = format(new Date(), 'yyyy-MM-dd');
    redirect(`/slots/${today}`);
  }

  if (filterDays.includes(selectedDate.getDay())) {
    let next = addDays(selectedDate, 1);
    while (filterDays.includes(next.getDay())) {
      next = addDays(next, 1);
    }
    const nextSlug = format(next, 'yyyy-MM-dd');
    redirect(`/slots/${nextSlug}`);
  }

  return (
    <div className="flex flex-col p-4 w-full items-center justify-between">
      <nav className="flex flex-col md:flex-row gap-4 justify-between w-full">
        <WeekPicker
          currentDate={selectedDate}
          highlightDate={selectedDate}
          filterDays={filterDays}
        />
        <NavButtons currentDate={selectedDate} filterDays={filterDays} />
      </nav>
      {children}
    </div>
  );
}
