"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createStageSchema,
  updateStageSchema,
  CreateStageInput,
  UpdateStageInput,
} from "@/lib/validators/stage";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StageFormProps {
  initialData: { id: string; name: string } | null;
  id: string;
}

export default function StageForm({ initialData, id }: StageFormProps) {
  const router = useRouter();
  const isNew = id === "new";

  const form = useForm<CreateStageInput>({
    resolver: zodResolver(createStageSchema),
    defaultValues: initialData ? { name: initialData.name } : { name: "" },
  });

  const onSubmit = async (values: CreateStageInput) => {
    const url = isNew ? "/api/stages" : `/api/stages/${id}`;
    const method = isNew ? "POST" : "PUT";

    // for update, zod only knows name; server‐side will merge id
    const payload = isNew
      ? values
      : (values as UpdateStageInput & { id: string });

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isNew ? values : { id, ...values }),
    });

    if (res.ok) {
      router.push("/settings");
    } else {
      console.error("Failed to save stage");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-md"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stage Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. New, Contacted" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {isNew ? "Create Stage" : "Update Stage"}
        </Button>
      </form>
    </Form>
  );
}
