'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createCourse } from '@/actions/courses';
import { CourseCreateInput, CourseCreateSchema } from '@/lib/validators/course';
import { CourseError } from '@/lib/errors';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { CourseDifficulty } from '@/lib/enums';
import { MultiSelect, MultiSelectOption } from './multi-select';
import { getFullName } from '@/lib/utils';
import { CoursesGetType, InstrumentType } from '@/app/global-types';
import { fetchEndpointsParallel } from '@/lib/utils/api-utils';

interface CourseFormProps {
  children: ReactNode;
}

export function CourseForm({ children }: CourseFormProps) {
  const router = useRouter();
  const form = useForm<CourseCreateInput>({
    resolver: zodResolver(CourseCreateSchema),
    defaultValues: {
      instrument_id: '',
      difficulty: CourseDifficulty.FOUNDATION,
      description: '',
      teachers: [],
    },
  });

  const [instructors, setInstructors] = useState<
    { value: string; label: string }[] | null
  >(null);
  const [instruments, setInstruments] = useState<MultiSelectOption[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const results = await fetchEndpointsParallel([
        '/api/team-members',
        '/api/instruments',
      ]);

      results.forEach(result => {
        if (result.error) {
          console.error(result.error);
        }

        switch (result.endpoint) {
          case '/api/team-members':
            const formattedInstructors = (
              result.data as CoursesGetType['teachers']
            )?.map(inst => ({
              value: inst!.id,
              label: getFullName(inst),
            }));
            setInstructors(formattedInstructors);
            break;
        }

        switch (result.endpoint) {
          case '/api/instruments': {
            const options = (result.data as InstrumentType[]).map(
              (r: InstrumentType) => ({
                label: r.name,
                value: r.id,
              }),
            );
            setInstruments(options);
            break;
          }
        }
      });
    };

    fetchData();
  }, []);

  const onSubmit = async (values: CourseCreateInput) => {
    try {
      const res = await createCourse(values);
      toast.success(res.message);
      form.reset();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      router.refresh();
    } catch (err) {
      if (err instanceof CourseError) {
        form.setError(err.field as keyof CourseCreateInput, {
          type: 'server',
          message: err.message,
        });
      } else {
        toast.error('Something went wrong.', {
          description: (err as Error)?.message,
        });
      }
    }
  };

  return (
    <Dialog modal={false}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Create Course</DialogTitle>
              <DialogDescription>Add a new course</DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="instrument_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instrument</FormLabel>
                  <FormControl>
                    <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Instrument" />
                      </SelectTrigger>
                      <SelectContent>
                        {instruments.map(instrument => (
                          <SelectItem
                            key={instrument.value}
                            value={instrument.value}
                          >
                            {instrument.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      value={field.value ?? CourseDifficulty.FOUNDATION}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(CourseDifficulty).map((cd, cdi) => (
                          <SelectItem key={`${cd}_${cdi}`} value={cd}>
                            {cd}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ''}
                      placeholder="Course description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teachers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign teachers</FormLabel>
                  <FormControl>
                    <MultiSelect
                      modalPopover={false}
                      options={instructors ?? []}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      placeholder="Select teachers"
                      maxCount={3}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Create Course</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
