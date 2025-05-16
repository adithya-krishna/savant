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
import TableDropdownMenu from "@/components/table-dropdown";

export default async function LeadsPage() {
  const leads = await db.leads.findMany({
    orderBy: { create_date: "desc" },
    include: {
      stage: true,
      // team_member: true,
      // instrument: true,
      // source: true,
    },
  });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Leads</h1>
        <Link href="/lead/new">
          <Button>Add Lead</Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Walk-in</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {leads.map((l) => (
            <TableRow key={l.id}>
              <TableCell>
                {l.first_name} {l.last_name ?? ""}
              </TableCell>
              <TableCell>{l.phone}</TableCell>
              <TableCell>{l.email ?? "—"}</TableCell>
              <TableCell>{l.stage?.name ?? "—"}</TableCell>
              <TableCell>
                {l.walkin_date
                  ? new Date(l.walkin_date).toLocaleDateString()
                  : "—"}
              </TableCell>
              <TableCell>
                <TableDropdownMenu id={l.id} type={"lead"} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
