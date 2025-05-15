import React from "react";
import Link from "next/link";
import { db } from "@/db";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DeleteItemButton } from "@/components/delete-item-button";

export default async function SettingsPage() {
  const stages = await db.stages.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Stage Settings</h1>
        <Link href="/stages/new">
          <Button>Add Stage</Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {stages.map((stage) => (
            <TableRow key={stage.id}>
              <TableCell>{stage.name}</TableCell>
              <TableCell className="space-x-2">
                <Link href={`/stages/${stage.id}`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
                <DeleteItemButton type="stage" id={stage.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
