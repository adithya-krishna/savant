'use client';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Prisma } from '@prisma/client';
import { getFullName } from '@/lib/utils';
import { DataTableColumnHeader } from '@/components/data-tables';
import TableDropdownMenu from '@/components/table-dropdown';
import { Badge } from '@/components/ui/badge';

type Lead = Prisma.LeadsGetPayload<{
  include: { stage: true; instruments: true; team_member: true };
}>;

const columnHelper = createColumnHelper<Lead>();

export const columns = [
  columnHelper.accessor(getFullName, {
    id: 'full_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('email', { header: 'Email' }),
  columnHelper.accessor('phone', { header: 'Phone Number' }),
  columnHelper.accessor(row => row.stage?.id as string, {
    id: 'stage',
    header: 'Stage',
    cell: info => info.row.original.stage?.name,
  }),
  columnHelper.accessor(row => getFullName(row.team_member), {
    id: 'team_member',
    header: 'Team Member',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor(row => row.instruments, {
    id: 'instruments',
    header: 'Instruments',
    cell: info => {
      const instruments = info.getValue() ?? [];
      return (
        <div className="flex flex-col gap-1">
          {instruments.map(i => (
            <Badge variant={'outline'} key={i.id}>
              {i.name}
            </Badge>
          ))}
        </div>
      );
    },
    enableSorting: false,
  }) as ColumnDef<Lead, string>,
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: info => <TableDropdownMenu id={info.row.original.id} type={'lead'} />,
    enableSorting: false,
    enableHiding: false,
  }) as ColumnDef<Lead, string>,
];
