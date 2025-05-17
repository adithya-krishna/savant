"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTeamMemberSchema,
  CreateTeamMemberInput,
} from "@/lib/validators/team-member";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "./ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import type { TeamMember } from "@prisma/client";
import { TeamMemberRole } from "@/lib/enums";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { PhoneInput } from "./phone-input";

interface TeamMemberFormProps {
  initialData: TeamMember | null;
  id: string;
}

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({ initialData, id }) => {
  const router = useRouter();
  const isNew = id === "new";

  const form = useForm<CreateTeamMemberInput>({
    resolver: zodResolver(createTeamMemberSchema),
    defaultValues: {
      first_name: initialData?.first_name ?? "",
      last_name: initialData?.last_name ?? "",
      email: initialData?.email ?? "",
      phone: initialData?.phone ?? "",
      role: initialData?.role ?? TeamMemberRole.STAFF,
      active: initialData?.active ?? false,
    },
  });

  const onSubmit = async (values: CreateTeamMemberInput) => {
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
        className="flex flex-col p-2 md:p-5 w-full mx-auto gap-2"
      >
        <div className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  First Name<span className="text-sm text-red-400">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your first name"
                    type={"text"}
                    value={field.value}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  Last Name<span className="text-sm text-red-400">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your last name"
                    type={"text"}
                    value={field.value}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                Phone<span className="text-sm text-red-400">*</span>
              </FormLabel>
              <FormControl>
                <PhoneInput
                  placeholder="Enter a phone number"
                  defaultCountry="IN"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Please enter a phone number for us to reach out to you
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  type={"email"}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val);
                  }}
                />
              </FormControl>
              <FormDescription>
                Please enter an email for us to reach out to you
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col gap-2 w-full py-1">
                <FormLabel>
                  Team Member Role
                  <span className="text-sm text-red-400">*</span>
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Team member roles</SelectLabel>
                        {Object.values(TeamMemberRole).map((tm, tmi) => (
                          <SelectItem key={`${tm}_${tmi}`} value={tm}>
                            {tm}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Select a role for the team member
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-col p-3 justify-center w-full border rounded">
              <div className="flex items-center justify-between h-full">
                <FormLabel>Is Team Member Active?</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
              <FormDescription>Turn on or off.</FormDescription>
            </FormItem>
          )}
        />
        <div className="flex justify-end items-center w-full pt-3">
          <Button className="rounded-lg" size="sm">
            {`${isNew ? "Create " : "Update"} Team Member`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TeamMemberForm;
