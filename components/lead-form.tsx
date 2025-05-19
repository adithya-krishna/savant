'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createLeadSchema, CreateLeadInput } from '@/lib/validators/lead';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
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
import { Checkbox } from '@/components/ui/checkbox';
import { PhoneInput } from './phone-input';
import { TeamMemberOption } from '@/app/global-types';

interface StageOption {
  id: string;
  name: string;
}
interface LeadFormProps {
  initialData: CreateLeadInput | null;
  id: string;
}

// move to utils

// types.ts
export type FetchResult<T> = {
  data: T | null;
  error: string | null;
  endpoint: string;
};

export async function fetchEndpointsParallel<T = any>(
  endpoints: string[],
  options?: RequestInit,
): Promise<FetchResult<T>[]> {
  try {
    const responses = await Promise.all(
      endpoints.map(endpoint => fetch(endpoint, options)),
    );

    const results: Promise<FetchResult<T>>[] = responses.map(
      async (res, index) => {
        if (!res.ok) {
          return {
            data: null,
            error: `Request failed with status ${res.status} for ${endpoints[index]}`,
            endpoint: endpoints[index],
          };
        }

        try {
          const data = await res.json();
          return {
            data,
            error: null,
            endpoint: endpoints[index],
          };
        } catch (parseError) {
          return {
            data: null,
            error: `Failed to parse JSON for ${endpoints[index]}`,
            endpoint: endpoints[index],
          };
        }
      },
    );

    return await Promise.all(results);
  } catch (error) {
    // Handle network errors or other fetch failures
    return endpoints.map(endpoint => ({
      data: null,
      error: `Network error occurred while fetching ${endpoint}`,
      endpoint,
    }));
  }
}
// move to utils end

export default function LeadForm({ initialData, id }: LeadFormProps) {
  const router = useRouter();
  const isNew = id === 'new';
  const [teamMembers, setTeamMembers] = useState<TeamMemberOption[] | null>(
    null,
  );
  const [stages, setStages] = useState<StageOption[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const results = await fetchEndpointsParallel([
        '/api/team-members',
        '/api/stages',
      ]);

      // Process results
      results.forEach(result => {
        if (result.error) {
          console.error(result.error);
          // You could also set these errors in state to display to the user
        }

        switch (result.endpoint) {
          case '/api/team-members':
            setTeamMembers(result.data || []);
            break;
          case '/api/stages':
            setStages(result.data || []);
            break;
        }
      });
    };

    fetchData();
  }, []);

  const form = useForm<CreateLeadInput>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      source_id: '',
      walkin_date: '',
      address: '',
      expected_budget: '',
      stage_id: '',
      demo_taken: false,
      color_code: '#000000',
      number_of_contact_attempts: 0,
      last_contacted_date: '',
      next_followup: '',
      team_member_id: '',
    },
  });

  const onSubmit = async (values: CreateLeadInput) => {
    const url = isNew ? '/api/leads' : `/api/leads/${id}`;
    const method = isNew ? 'POST' : 'PUT';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, id }),
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
        className="flex flex-col w-full space-y-6"
      >
        <div className="flex flex-col md:flex-row w-full gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription className="text-xs">
                  Lead's given name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} />
                </FormControl>
                <FormDescription className="text-xs">
                  Optional surname.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <PhoneInput
                  placeholder="Enter a phone number"
                  defaultCountry="IN"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs">
                Primary contact number.
              </FormDescription>
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
                <Input {...field} value={field.value ?? ''} type="email" />
              </FormControl>
              <FormDescription className="text-xs">
                Optional business email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="walkin_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Walk-in Date</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} type="date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="next_followup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Next Follow-up</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  type="datetime-local"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expected_budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expected Budget (₹)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  type="number"
                  step="0.01"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stage_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stage</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ''}
                  disabled={stages.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
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
          name="demo_taken"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1">
                <FormLabel className="font-normal">Demo Taken</FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="team_member_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign Team Member</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ''}
                  disabled={!teamMembers}
                >
                  <SelectTrigger>
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

        <FormField
          control={form.control}
          name="color_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color Code</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormDescription className="text-xs">
                Hex code, e.g. #a1b2c3
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="max-w-36"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {isNew ? 'Create Lead' : 'Update Lead'}
        </Button>
      </form>
    </Form>
  );
}
