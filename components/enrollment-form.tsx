'use client';

import { useEffect, useState } from 'react';
import PreferredSlotSelect from './preferred-slots-selection';
import {
  CourseType,
  PlanType,
  SelectOptionType,
  TimeSlotSelection,
} from '@/app/global-types';
import { useForm } from 'react-hook-form';
import {
  EnrollmentCreateInput,
  EnrollmentCreateSchema,
} from '@/lib/validators/enrollment';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Button } from './ui/button';
import { fetchEndpointsParallel } from '@/lib/utils/api-utils';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

const EnrollmentForm = ({ id: student_id }: { id: string }) => {
  const [selectedSlots, setSelectedSlots] = useState<TimeSlotSelection>({});
  const [plans, setPlans] = useState<PlanType[]>([]);
  const [courses, setSourses] = useState<SelectOptionType[]>([]);

  const form = useForm<EnrollmentCreateInput>({
    resolver: zodResolver(EnrollmentCreateSchema),
    defaultValues: {
      student_id,
      course_id: '',
      plan_code: '',
    },
  });

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
        }

        switch (result.endpoint) {
          case '/api/courses': {
            const options = (result.data as CourseType[]).map(r => ({
              label: r.name,
              value: r.id,
            }));
            setSourses(options);
            break;
          }
        }
      });
    };

    fetchData();
  }, []);

  function onSubmit(values: EnrollmentCreateInput) {
    console.log({ ...values, selectedSlots });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-lg mx-auto py-10"
      >
        <input type="hidden" {...form.register('status')} value={'ACTIVE'} />

        <FormField
          control={form.control}
          name="course_id"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Select Course</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'w-[280px] justify-between',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      <span className="truncate max-w-[220px] block">
                        {field.value
                          ? courses.find(course => course.value === field.value)
                              ?.label
                          : 'Select Course'}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0">
                  <Command>
                    <CommandInput placeholder="Search Course..." />
                    <CommandList>
                      <CommandEmpty>No Course found.</CommandEmpty>
                      <CommandGroup>
                        {courses.map(course => (
                          <CommandItem
                            value={course.label}
                            key={course.value}
                            onSelect={() => {
                              form.setValue('course_id', course.value);
                            }}
                            className={cn(
                              course.value === field.value
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

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="plan_code"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Select Plan</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {plans.map(p => (
                    <FormItem
                      key={p.code}
                      className={cn(
                        'flex flex-row items-start justify-between rounded-lg border p-3 shadow-sm',
                        p.code === field.value ? 'border-primary' : '',
                      )}
                    >
                      <div className="space-y-0.5">
                        <FormLabel className="font-normal cursor-pointer">
                          {p.name}
                        </FormLabel>
                        <FormDescription className="text-xs mt-2">
                          {p.description}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <RadioGroupItem value={p.code} />
                      </FormControl>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <PreferredSlotSelect
          setSlots={setSelectedSlots}
          selectedSlots={selectedSlots}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default EnrollmentForm;
