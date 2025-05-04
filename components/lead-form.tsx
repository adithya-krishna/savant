"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createLeadSchema,
  updateLeadSchema,
  CreateLeadInput,
} from "@/lib/validators/lead";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface CounselorOption {
  id: string;
  first_name: string;
  last_name: string;
}
interface StageOption {
  id: string;
  name: string;
}
interface LeadFormProps {
  initialData: CreateLeadInput | null;
  id: string;
}

export default function LeadForm({ initialData, id }: LeadFormProps) {
  const router = useRouter();
  const isNew = id === "new";
  const [counselors, setCounselors] = useState<CounselorOption[] | null>(null);
  const [stages, setStages] = useState<StageOption[]>([]);

  useEffect(() => {
    fetch("/api/team-members")
      .then((res) => res.json())
      .then(setCounselors)
      .catch((err) => {
        console.error("Failed to load counselors", err);
        setCounselors([]);
      });
  }, []);

  // fetch stages
  useEffect(() => {
    fetch("/api/stages")
      .then((res) => res.json())
      .then(setStages)
      .catch(() => setStages([]));
  }, []);

  const form = useForm<CreateLeadInput>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: initialData
      ? {
          first_name: initialData.first_name,
          last_name: initialData.last_name ?? "",
          country_code: initialData.country_code ?? "+91",
          phone: initialData.phone,
          email: initialData.email ?? "",
          parent_name: initialData.parent_name ?? "",
          parent_phone: initialData.parent_phone ?? "",
          source: initialData.source ?? "",
          source_detail: initialData.source_detail ?? "",
          how_heard_about_us: initialData.how_heard_about_us ?? "",
          walkin_date: initialData.walkin_date ?? "",
          location_name: initialData.location_name ?? "",
          subject_interested: initialData.subject_interested ?? "",
          expected_budget: initialData.expected_budget ?? "",
          stage_id: initialData.stage_id ?? "",
          demo_taken: initialData.demo_taken ?? false,
          color_code: initialData.color_code ?? "#000000",
          number_of_contact_attempts:
            initialData.number_of_contact_attempts ?? 0,
          last_contacted_date: initialData.last_contacted_date ?? "",
          next_followup: initialData.next_followup ?? "",
          counselor_id: initialData.counselor_id ?? "",
        }
      : {
          first_name: "",
          last_name: "",
          country_code: "+91",
          phone: "",
          email: "",
          parent_name: "",
          parent_phone: "",
          source: "",
          source_detail: "",
          how_heard_about_us: "",
          walkin_date: "",
          location_name: "",
          subject_interested: "",
          expected_budget: "",
          stage_id: "",
          demo_taken: false,
          color_code: "#000000",
          number_of_contact_attempts: 0,
          last_contacted_date: "",
          next_followup: "",
          counselor_id: "",
        },
  });

  const onSubmit = async (values: CreateLeadInput) => {
    const url = isNew ? "/api/leads" : `/api/leads/${id}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, id }),
    });

    if (res.ok) {
      router.push("/leads");
    } else {
      console.error("Failed to save lead");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-lg"
      >
        {/* First Name */}
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Lead's given name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Last Name */}
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Optional surname.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} type="tel" />
              </FormControl>
              <FormDescription>Primary contact number.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormDescription>Optional business email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Walk-in Date */}
        <FormField
          control={form.control}
          name="walkin_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Walk-in Date</FormLabel>
              <FormControl>
                <Input {...field} type="date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Next Follow-up */}
        <FormField
          control={form.control}
          name="next_followup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Next Follow-up</FormLabel>
              <FormControl>
                <Input {...field} type="datetime-local" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Expected Budget */}
        <FormField
          control={form.control}
          name="expected_budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expected Budget (₹)</FormLabel>
              <FormControl>
                <Input {...field} type="number" step="0.01" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Stage */}
        <FormField
          control={form.control}
          name="stage_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stage</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={stages.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((s) => (
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

        {/* Demo Taken */}
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

        {/* Counselor Picker */}
        <FormField
          control={form.control}
          name="counselor_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign Counselor</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!counselors}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select counselor" />
                  </SelectTrigger>
                  <SelectContent>
                    {counselors?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.first_name} {c.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Color Code */}
        <FormField
          control={form.control}
          name="color_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color Code</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Hex code, e.g. #a1b2c3</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {isNew ? "Create Lead" : "Update Lead"}
        </Button>
      </form>
    </Form>
  );
}
