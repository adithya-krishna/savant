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
import TableDropdownMenu from "@/components/table-dropdown";

export default async function TeamMembersPage() {
  const counselors = await db.counselors.findMany({
    orderBy: { create_date: "desc" },
  });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Team Members</h1>
        <Link href="/team-member/new">
          <Button>Add Team Member</Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {counselors.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{`${c.first_name} ${c.last_name}`}</TableCell>
              <TableCell>{c.email ?? "—"}</TableCell>
              <TableCell>{`${c.country_code} ${c.phone}`}</TableCell>
              <TableCell>{c.role ?? "—"}</TableCell>
              <TableCell>{c.active ? "Yes" : "No"}</TableCell>
              <TableCell>
                <TableDropdownMenu id={c.id} type="team-member" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
