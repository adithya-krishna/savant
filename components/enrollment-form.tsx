'use client';

import { FormEvent, ReactNode, useEffect, useReducer, useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

type FormState = {
  student_id: string;
  course_id: string;
  plan_code: string;
  status: string;
  start_date: Date | null;
  slots_remaining: number;
  preferred_time_slots: TimeSlotSelection;
  amount_paid: '0';
};

type Action =
  | { type: 'SET_COURSE'; payload: string }
  | { type: 'SET_PLAN'; payload: string }
  | { type: 'SET_STATUS'; payload: string }
  | { type: 'SET_START_DATE'; payload: Date }
  | { type: 'SET_SLOTS_REMAINING'; payload: number }
  | { type: 'SET_PREFERRED_SLOT'; payload: TimeSlotSelection }
  | { type: 'RESET_FORM'; payload: FormState };

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
    case 'SET_PREFERRED_SLOT':
      return { ...state, preferred_time_slots: action.payload };
    case 'RESET_FORM':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const initialState: FormState = {
  student_id: '',
  course_id: '',
  plan_code: '',
  status: 'ACTIVE',
  start_date: null,
  slots_remaining: 0,
  preferred_time_slots: {},
  amount_paid: '0',
};

const EnrollmentForm = ({
  id: student_id,
  studentName,
  children,
}: {
  id: string;
  studentName: string;
  children: ReactNode;
}) => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    student_id,
  });

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
    };

    fetchData();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const postData = {
      ...state,
    };

    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (res.ok) {
        dispatch({
          type: 'RESET_FORM',
          payload: { ...initialState, student_id },
        });
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        router.refresh();
      } else {
        console.error('Failed to save lead');
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Dialog modal={false}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>Create Enrollment</DialogTitle>
          <DialogDescription>
            Create an enrollment for {studentName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-8 pt-6">
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
                    <Label
                      className="font-normal cursor-pointer"
                      htmlFor={p.code}
                    >
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
              selectedSlots={state.preferred_time_slots}
              setSlotsAction={slots =>
                dispatch({ type: 'SET_PREFERRED_SLOT', payload: slots })
              }
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
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollmentForm;
