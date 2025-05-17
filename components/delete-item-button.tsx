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
import { Trash2 } from "lucide-react";

type Vairants = "default" | "menu-item" | "icon";
interface DeleteItemButtonProps {
  id: string;
  type: SectionTypes;
  variant?: Vairants;
}

function getTriggerComponent(variant: Vairants) {
  switch (variant) {
    case "menu-item":
      return (
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <span className="text-red-600 text-sm">Delete</span>
        </DropdownMenuItem>
      );
    case "icon":
      return (
        <Button variant="destructive" size="icon">
          <Trash2 />
        </Button>
      );
    default:
      return (
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      );
  }
}

export function DeleteItemButton({
  id,
  type,
  variant = "default",
}: DeleteItemButtonProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const triggerContent = getTriggerComponent(variant);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/${type}s/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert(`Failed to delete the ${type}`);
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
