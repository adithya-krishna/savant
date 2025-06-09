'use client';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { getFullName } from '@/lib/utils';
import { DataTableColumnHeader } from '@/components/data-tables';
import TableDropdownMenu from '@/components/table-dropdown';
import { StudentsGetType } from '@/app/global-types';
import { format } from 'date-fns';

const columnHelper = createColumnHelper<StudentsGetType>();

export const columns = [
  columnHelper.accessor(getFullName, {
    id: 'full_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: info => info.getValue(),
  }),
  columnHelper.accessor(
    row =>
      getFullName({
        first_name: row.parent_first_name,
        last_name: row.parent_last_name,
      }),
    {
      id: 'parent_full_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Parent Name" />
      ),
      cell: info => info.getValue(),
    },
  ),
  columnHelper.accessor('primary_contact', { header: 'Contact number' }),
  columnHelper.accessor('gender', { header: 'Gender' }) as ColumnDef<
    StudentsGetType,
    string
  >,
  columnHelper.accessor('create_date', {
    header: 'Created on',
    cell: info => format(info.getValue(), 'PPP'),
  }) as ColumnDef<StudentsGetType, string>,
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: info => (
      <TableDropdownMenu id={info.row.original.id} type={'student'} />
    ),
    enableSorting: false,
    enableHiding: false,
  }) as ColumnDef<StudentsGetType, string>,
];
