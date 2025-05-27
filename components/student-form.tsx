'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  UpdateStudentInput,
  updateStudentSchema,
} from '@/lib/validators/students';
import { PhoneInput } from './phone-input';
import { Textarea } from './ui/textarea';
import { cn } from '@/lib/utils';
import { Calendar } from './ui/calendar';
import { Gender } from '@/lib/enums';
import { useRouter } from 'next/navigation';

interface StudentFormProps {
  initialData: UpdateStudentInput;
}

export default function StudentForm({ initialData }: StudentFormProps) {
  const router = useRouter();
  const form = useForm<UpdateStudentInput>({
    resolver: zodResolver(updateStudentSchema),
    defaultValues: {
      first_name: initialData.first_name ?? '',
      last_name: initialData.last_name ?? '',
      primary_contact: initialData.primary_contact ?? '',
      secondary_contact: initialData.secondary_contact ?? '',
      parent_first_name: initialData.parent_first_name ?? '',
      parent_last_name: initialData.parent_last_name ?? '',
      parent_phone: initialData.parent_phone ?? '',
      address: initialData.address ?? '',
      gender: initialData.gender ?? Gender.UNDISCLOSED,
      email: initialData.email ?? '',
      dob: initialData.dob,
    },
  });

  async function onSubmit(values: UpdateStudentInput) {
    try {
      const res = await fetch(`/api/students/${initialData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          dob: format(values.dob!, 'yyyy-MM-dd'),
        }),
      });
      if (res.ok) {
        router.push(`/students/${initialData.id}`);
      } else {
        console.error('Failed to save Student');
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full max-w-2xl mx-auto"
      >
        <input type="hidden" {...form.register('id')} value={initialData.id} />
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., John"
                      type="text"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-3">
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Doe"
                      type="text"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="primary_contact"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>Primary Contact Number</FormLabel>
                  <FormControl className="w-full">
                    <PhoneInput
                      placeholder="e.g., 12345 67890"
                      {...field}
                      defaultCountry="IN"
                      value={field.value ?? ''}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-3">
            <FormField
              control={form.control}
              name="secondary_contact"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>Alternate contact number</FormLabel>
                  <FormControl className="w-full">
                    <PhoneInput
                      placeholder="e.g., 12345 67890"
                      {...field}
                      defaultCountry="IN"
                      value={field.value ?? ''}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="parent_first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Joe"
                      type="text"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-3">
            <FormField
              control={form.control}
              name="parent_last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Bloggs"
                      type="text"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="parent_phone"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel>Parent&apos;s Phone Number</FormLabel>
              <FormControl className="w-full">
                <PhoneInput
                  placeholder="e.g., 12345 67890"
                  {...field}
                  defaultCountry="IN"
                  value={field.value ?? ''}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Address</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Bakers st., Koramangala"
                  className="resize-none"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-3">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ''}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select Gender</SelectLabel>
                        {Object.values(Gender).map((g, gi) => (
                          <SelectItem key={`${g}_${gi}`} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>email</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g, john@example.com"
                  type="email"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
