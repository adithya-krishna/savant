"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { SectionTypes } from "@/app/global-types";

interface DeleteItemButtonProps {
  id: string;
  type: SectionTypes;
  variant?: "default" | "menu-item";
}

export function DeleteItemButton({
  id,
  type,
  variant = "default",
}: DeleteItemButtonProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const apiPath = type === "team-member" ? "/api/team-members" : "/api/leads";

  const triggerContent =
    variant === "menu-item" ? (
      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
        <span className="text-red-600 text-sm">Delete</span>
      </DropdownMenuItem>
    ) : (
      <Button variant="destructive" size="sm">
        Delete
      </Button>
    );

  const handleDelete = async () => {
    try {
      const res = await fetch(`${apiPath}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to delete the team member.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{triggerContent}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this {type}? <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={() => {
                handleDelete();
                setOpen(false);
              }}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
