"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCounselorSchema,
  updateCounselorSchema,
  CreateCounselorInput,
} from "@/lib/validators/counselor";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface CounselorFormProps {
  initialData: (Partial<CreateCounselorInput> & { id: string }) | null;
  id: string;
}

const CounselorForm: React.FC<CounselorFormProps> = ({ initialData, id }) => {
  const router = useRouter();
  const isNew = id === "new";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateCounselorInput>({
    resolver: zodResolver(
      isNew ? createCounselorSchema : updateCounselorSchema
    ),
    defaultValues: initialData ?? {
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
    const url = isNew ? "/api/team-member" : `/api/team-member/${id}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      router.push("/team-members");
    } else {
      // handle errors as needed
      console.error("Failed to save");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div>
        <Label htmlFor="first_name">First Name</Label>
        <Input id="first_name" {...register("first_name")} />
        {errors.first_name && (
          <p className="text-red-600">{errors.first_name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="last_name">Last Name</Label>
        <Input id="last_name" {...register("last_name")} />
        {errors.last_name && (
          <p className="text-red-600">{errors.last_name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="country_code">Country Code</Label>
        <Input id="country_code" {...register("country_code")} />
        {errors.country_code && (
          <p className="text-red-600">{errors.country_code.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" {...register("phone")} />
        {errors.phone && <p className="text-red-600">{errors.phone.message}</p>}
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <Input id="role" {...register("role")} />
        {errors.role && <p className="text-red-600">{errors.role.message}</p>}
      </div>

      <Controller
        name="active"
        control={control}
        render={({ field }) => (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="active">Active</Label>
          </div>
        )}
      />

      <div className="pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isNew ? "Create Team Member" : "Update Team Member"}
        </Button>
      </div>
    </form>
  );
};

export default CounselorForm;
