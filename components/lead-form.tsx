'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateLeadInput, updateLeadSchema } from '@/lib/validators/lead';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PhoneInput } from './phone-input';
import { TeamMemberType } from '@/app/global-types';
import { getFullName } from '@/lib/utils';
import { fetchEndpointsParallel } from '@/lib/utils/api-utils';

interface SourceOption {
  id: string;
  source: string;
}
interface LeadFormProps {
  initialData: UpdateLeadInput | null;
}

// move to utils

// types.ts

// move to the utils end

export default function LeadForm({ initialData }: LeadFormProps) {
  const router = useRouter();
  const form = useForm<UpdateLeadInput>({
    resolver: zodResolver(updateLeadSchema),
    defaultValues: {
      id: initialData?.id,
      first_name: initialData?.first_name ?? '',
      last_name: initialData?.last_name ?? '',
      phone: initialData?.phone ?? '',
      email: initialData?.email ?? '',
      area: initialData?.area ?? '',
      community: initialData?.community ?? '',
      source_id: initialData?.source_id ?? '',
      team_member_id: initialData?.team_member_id ?? '',
    },
  });

  const [teamMembers, setTeamMembers] = useState<TeamMemberType[] | null>(null);
  const [sources, setSources] = useState<SourceOption[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const results = await fetchEndpointsParallel([
        '/api/team-members',
        '/api/sources',
      ]);

      // Process results
      results.forEach(result => {
        if (result.error) {
          console.error(result.error);
          // You could also set these errors in state to display to the user
        }

        switch (result.endpoint) {
          case '/api/team-members':
            setTeamMembers((result.data as TeamMemberType[]) || []);
            break;
          case '/api/sources':
            setSources((result.data as SourceOption[]) || []);
            break;
        }
      });
    };

    fetchData();
  }, []);

  const onSubmit = async (values: UpdateLeadInput) => {
    const res = await fetch(`/api/leads/${values.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values }),
    });

    if (res.ok) {
      router.push('/leads');
    } else {
      console.error('Failed to save lead');
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full max-w-4xl mx-auto py-8"
      >
        <input type="hidden" {...form.register('id')} />

        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John" type="text" {...field} />
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

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel>Phone number</FormLabel>
              <FormControl className="w-full">
                <PhoneInput
                  placeholder="Placeholder"
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

        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Jakkur"
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
              name="community"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Community</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Shobha city"
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
              name="source_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? ''}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sources.map(s => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="team_member_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Member</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? ''}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select team member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teamMembers?.map(tm => (
                        <SelectItem key={tm.id} value={tm.id}>
                          {getFullName(tm)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
