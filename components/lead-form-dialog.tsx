'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PhoneInput } from '@/components/phone-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateLeadInput, createLeadSchema } from '@/lib/validators/lead';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { useEffect, useState } from 'react';
import { fetchEndpointsParallel } from './lead-form';
import { TeamMemberOption, InstrumentType } from '@/app/global-types';
import { useRouter } from 'next/navigation';
import { MultiSelect, MultiSelectOption } from './multi-select';

export default function LeadFormDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const form = useForm<CreateLeadInput>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      address: '',
      instrument_ids: [],
      team_member_id: '',
    },
  });
  const [teamMembers, setTeamMembers] = useState<TeamMemberOption[] | null>(
    null,
  );
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
            setTeamMembers(result.data || []);
            break;
        }

        switch (result.endpoint) {
          case '/api/instruments': {
            const options = result.data.map((r: InstrumentType) => ({
              label: r.name,
              value: r.id,
            }));
            setInstruments(options);
            break;
          }
        }
      });
    };

    fetchData();
  }, []);

  const onSubmit = async (values: CreateLeadInput) => {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, id: 'new' }),
    });

    if (res.ok) {
      form.reset();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      router.refresh();
    } else {
      console.error('Failed to save lead');
    }
  };

  return (
    <Dialog modal={false}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl overflow-y-scroll max-h-screen">
        <DialogHeader>
          <DialogTitle>Create Lead</DialogTitle>
          <DialogDescription>Add a new Lead to your pipeline</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6">
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

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 221B Baker Street, Koramangala, Bengaluru, Karnataka 560034"
                      className="resize-none"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>Phone number</FormLabel>
                  <FormControl className="w-full">
                    <PhoneInput
                      placeholder="e.g., 12345 67890"
                      {...field}
                      defaultCountry="IN"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., john@example.com"
                      type="email"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instrument_ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Instruments</FormLabel>
                  <FormControl>
                    <MultiSelect
                      modalPopover={false}
                      options={instruments}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      placeholder="Select options"
                      maxCount={3}
                    />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>

            <FormField
              control={form.control}
              name="team_member_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign Team Member</FormLabel>
                  <FormControl className="w-full">
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ''}
                      disabled={!teamMembers}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select team member" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers?.map(tm => (
                          <SelectItem key={tm.id} value={tm.id}>
                            {tm.first_name} {tm.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
