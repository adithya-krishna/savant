'use client';

import { Button } from '@/components/ui/button';
import { addDays, subDays, format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface NavProps {
  currentDate: Date;
  filterDays?: number[];
}

export default function NavButtons({ currentDate, filterDays = [] }: NavProps) {
  const getPrevSlug = () => {
    let d = subDays(currentDate, 1);
    while (filterDays.includes(d.getDay())) {
      d = subDays(d, 1);
    }
    return format(d, 'yyyy-MM-dd');
  };

  const getNextSlug = () => {
    let d = addDays(currentDate, 1);
    while (filterDays.includes(d.getDay())) {
      d = addDays(d, 1);
    }
    return format(d, 'yyyy-MM-dd');
  };

  const prevDate = getPrevSlug();
  const nextDate = getNextSlug();
  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="flex gap-2 items-center">
      <Button asChild size={'icon'}>
        <Link href={`/slots/${prevDate}`}>
          <ChevronLeft />
        </Link>
      </Button>
      <Button asChild size={'icon'}>
        <Link href={`/slots/${nextDate}`}>
          <ChevronRight />
        </Link>
      </Button>
      <Button asChild>
        <Link href={`/slots/${today}`}>Today</Link>
      </Button>
    </div>
  );
}
