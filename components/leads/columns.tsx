'use client';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import TableDropdownMenu from '../table-dropdown';
import { DataTableColumnHeader } from '../dt-column-header';
import { Prisma } from '@prisma/client';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';

type Lead = Prisma.LeadsGetPayload<{
  include: { stage: true; instruments: true; team_member: true };
}>;

const columnHelper = createColumnHelper<Lead>();

export const columns = [
  //   columnHelper.display({
  //     id: 'select',
  //     header: ({ table }) => (
  //       <Checkbox
  //         checked={
  //           table.getIsAllPageRowsSelected() ||
  //           (table.getIsSomePageRowsSelected() && 'indeterminate')
  //         }
  //         onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
  //         aria-label="Select all"
  //       />
  //     ),
  //     cell: ({ row }) => (
  //       <Checkbox
  //         checked={row.getIsSelected()}
  //         onCheckedChange={value => row.toggleSelected(!!value)}
  //         aria-label="Select row"
  //       />
  //     ),
  //     enableSorting: false,
  //     enableHiding: false,
  //   }) as ColumnDef<Lead, string>,
  columnHelper.accessor(row => `${row.first_name} ${row.last_name}`, {
    id: 'full_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('email', { header: 'Email' }),
  columnHelper.accessor('phone', { header: 'Phone Number' }),
  columnHelper.accessor(row => row.stage?.name as string, {
    id: 'stage',
    header: 'Stage',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor(
    row => `${row.team_member?.first_name} ${row.team_member?.last_name}`,
    {
      id: 'team_member',
      header: 'Team Member',
      cell: info => info.getValue(),
    },
  ),
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
