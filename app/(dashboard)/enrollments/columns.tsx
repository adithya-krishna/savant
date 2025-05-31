'use client';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { EnrollmentsGetType } from '@/app/global-types';
import TableDropdownMenu from '@/components/table-dropdown';
import { DataTableColumnHeader } from '@/components/data-tables';
import { getFullName } from '@/lib/utils';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { CircleCheck } from 'lucide-react';

const columnHelper = createColumnHelper<EnrollmentsGetType>();

export const columns = [
  columnHelper.accessor(row => getFullName(row.student), {
    id: 'full_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('start_date', {
    header: 'Starts on',
    cell: info => format(info.getValue(), 'do MMM'),
  }) as ColumnDef<EnrollmentsGetType, string>,
  columnHelper.accessor(row => row.status, {
    id: 'status',
    header: 'Status',
    cell: info => (
      <Badge variant="outline" className="capitalize">
        <CircleCheck size={14} className="text-primary" />
        {info.getValue().toLowerCase()}
      </Badge>
    ),
  }) as ColumnDef<EnrollmentsGetType, string>,
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: info => (
      <TableDropdownMenu id={info.row.original.id} type={'enrollments'} />
    ),
    enableSorting: false,
    enableHiding: false,
  }) as ColumnDef<EnrollmentsGetType, string>,
];
