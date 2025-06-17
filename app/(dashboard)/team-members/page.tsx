import React, { cache } from 'react';
import Link from 'next/link';
import { db } from '@/db';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import TableDropdownMenu from '@/components/table-dropdown';

const getTeamMembers = cache(async () => {
  return await db.teamMember.findMany({
    orderBy: { create_date: 'desc' },
    where: { first_name: { not: 'DUMMY' } },
  });
});

export default async function TeamMembersPage() {
  const teamMembers = await getTeamMembers();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Team Members</h1>
        <Link href="/team-member/new">
          <Button>Add Team Member</Button>
        </Link>
      </div>

      <div className="rounded-md border">
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
            {teamMembers.map(tm => (
              <TableRow key={tm.id}>
                <TableCell>{`${tm.first_name} ${tm.last_name}`}</TableCell>
                <TableCell>{tm.email ?? '—'}</TableCell>
                <TableCell>{tm.phone}</TableCell>
                <TableCell>{tm.role ?? '—'}</TableCell>
                <TableCell>{tm.active ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <TableDropdownMenu id={tm.id} type="team-member" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
