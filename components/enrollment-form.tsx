'use client';

import { useEffect, useReducer, useState } from 'react';
import PreferredSlotSelect from './preferred-slots-selection';
import {
  CourseType,
  PlanType,
  SelectOptionType,
  TimeSlotSelection,
} from '@/app/global-types';
import { Button } from './ui/button';
import { fetchEndpointsParallel } from '@/lib/utils/api-utils';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { format } from 'date-fns';
import { Calendar } from './ui/calendar';
import { Skeleton } from './ui/skeleton';

type FormState = {
  student_id: string;
  course_id: string;
  plan_code: string;
  status: string;
  start_date: Date | null;
  slots_remaining: number;
};

type Action =
  | { type: 'SET_COURSE'; payload: string }
  | { type: 'SET_PLAN'; payload: string }
  | { type: 'SET_STATUS'; payload: string }
  | { type: 'SET_START_DATE'; payload: Date }
  | { type: 'SET_SLOTS_REMAINING'; payload: number };

const reducer = (state: FormState, action: Action): FormState => {
  switch (action.type) {
    case 'SET_COURSE':
      return { ...state, course_id: action.payload };
    case 'SET_PLAN':
      return { ...state, plan_code: action.payload };
    case 'SET_STATUS':
      return { ...state, status: action.payload };
    case 'SET_START_DATE':
      return { ...state, start_date: action.payload };
    case 'SET_SLOTS_REMAINING':
      return { ...state, slots_remaining: action.payload };
    default:
      return state;
  }
};

const EnrollmentForm = ({ id: student_id }: { id: string }) => {
  const [state, dispatch] = useReducer(reducer, {
    student_id,
    course_id: '',
    plan_code: '',
    status: 'ACTIVE',
    start_date: null,
    slots_remaining: 0,
  });

  const [isLoading, setLoading] = useState<boolean>(true);
  const [selectedSlots, setSelectedSlots] = useState<TimeSlotSelection>({});
  const [plans, setPlans] = useState<PlanType[]>([]);
  const [courses, setCourses] = useState<SelectOptionType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const results = await fetchEndpointsParallel([
        '/api/plans',
        '/api/courses',
      ]);

      results.forEach(result => {
        if (result.error) {
          console.error(result.error);
        }

        switch (result.endpoint) {
          case '/api/plans':
            setPlans(result.data as PlanType[]);
            break;
          case '/api/courses':
            const options = (result.data as CourseType[]).map(r => ({
              label: r.name,
              value: r.id,
            }));
            setCourses(options);
            break;
        }
      });

      setLoading(false);
    };

    fetchData();
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('Form Submission:', {
      ...state,
      preferred_time_slots: selectedSlots,
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-8 w-lg mx-auto py-10">
        <div>
          <Skeleton className="w-20 h-3 rounded-lg mb-2" />
          <Skeleton className="w-full h-9 rounded-lg" />
        </div>
        <div>
          <Skeleton className="w-16 h-3 rounded-lg mb-2" />
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-16 mb-4 rounded-lg" />
          ))}
        </div>
        <div>
          <Skeleton className="w-40 h-3 rounded-lg mb-2" />
          <Skeleton className="w-full h-32 rounded-lg" />
        </div>
        <div>
          <Skeleton className="w-16 h-9 rounded-lg mb-2" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8 max-w-lg mx-auto py-10">
      <input type="hidden" value={state.status} />

      <div className="flex flex-col">
        <Label className="mb-2">Select Course</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                'w-full justify-between',
                !state.course_id && 'text-muted-foreground',
              )}
            >
              <span className="truncate max-w-[220px] block">
                {state.course_id
                  ? courses.find(c => c.value === state.course_id)?.label
                  : 'Pick a Course'}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search Course..." />
              <CommandList>
                <CommandEmpty>No Course found.</CommandEmpty>
                <CommandGroup>
                  {courses.map(course => (
                    <CommandItem
                      key={course.value}
                      value={course.label}
                      onSelect={() =>
                        dispatch({
                          type: 'SET_COURSE',
                          payload: course.value,
                        })
                      }
                      className={cn(
                        course.value === state.course_id
                          ? 'text-primary data-[selected=true]:text-primary'
                          : '',
                      )}
                    >
                      {course.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-3">
        <Label className="mb-2">Select Plan</Label>
        <RadioGroup
          value={state.plan_code}
          onValueChange={id => {
            const selectedPlan = plans.filter(p => p.code === id)[0];
            dispatch({ type: 'SET_PLAN', payload: id });
            dispatch({
              type: 'SET_SLOTS_REMAINING',
              payload: selectedPlan.total_slots,
            });
          }}
          className="flex flex-col space-y-1"
        >
          {plans.map(p => (
            <div
              key={p.code}
              className={cn(
                'flex flex-row items-start justify-between rounded-lg border p-3 shadow-sm',
                p.code === state.plan_code ? 'border-primary' : '',
              )}
            >
              <div className="space-y-0.5">
                <Label className="font-normal cursor-pointer" htmlFor={p.code}>
                  {p.name}
                </Label>
                <p className="text-xs mt-2 text-muted-foreground">
                  {p.description}
                </p>
              </div>
              <RadioGroupItem value={p.code} id={p.code} />
            </div>
          ))}
        </RadioGroup>
      </div>

      <Label className="mb-2">Select preferred time slots</Label>
      <div className="border rounded-lg">
        <PreferredSlotSelect
          selectedSlots={selectedSlots}
          setSlots={setSelectedSlots}
        />
      </div>

      <div>
        <Label className="mb-2">Start from</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal',
                !state.start_date && 'text-muted-foreground',
              )}
            >
              <CalendarIcon />
              {state.start_date ? (
                format(state.start_date, 'PPP')
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              fromDate={new Date()}
              selected={state.start_date ?? new Date()}
              onSelect={date =>
                dispatch({ type: 'SET_START_DATE', payload: date! as Date })
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button type="submit">Submit</Button>
    </form>
  );
};

export default EnrollmentForm;
