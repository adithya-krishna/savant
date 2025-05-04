"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCounselorSchema,
  updateCounselorSchema,
  CreateCounselorInput,
} from "@/lib/validators/counselor";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "./ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import type { counselors } from "@prisma/client";

interface CounselorFormProps {
  initialData: counselors | null;
  id: string;
}

const CounselorForm: React.FC<CounselorFormProps> = ({ initialData, id }) => {
  const router = useRouter();
  const isNew = id === "new";

  const form = useForm<CreateCounselorInput>({
    resolver: zodResolver(
      isNew ? createCounselorSchema : updateCounselorSchema
    ),
    defaultValues: initialData
      ? {
          first_name: initialData.first_name,
          last_name: initialData.last_name,
          email: initialData.email ?? "",
          phone: initialData.phone,
          country_code: initialData.country_code ?? "+91",
          role: initialData.role ?? "",
          active: initialData.active ?? false,
        }
      : {
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          country_code: "+91",
          role: "",
          active: true,
        },
  });

  const onSubmit = async (values: CreateCounselorInput) => {
    const url = isNew ? "/api/team-members" : `/api/team-members/${id}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      router.push("/team-members");
    } else {
      console.error("Failed to save");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-lg"
      >
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} id="first_name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} id="last_name" />
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
                <Input {...field} type="email" id="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country Code</FormLabel>
              <FormControl>
                <Input {...field} id="country_code" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} id="phone" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Input {...field} id="role" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="active"
                />
              </FormControl>
              <div className="space-y-1">
                <FormLabel className="font-normal">Active</FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {`${isNew ? "Create " : "Update"} Team Member`}
        </Button>
      </form>
    </Form>
  );
};

export default CounselorForm;
