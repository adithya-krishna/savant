'use client';

import { DataTable } from '@/components/data-tables';
import { CoursesGetType } from '@/app/global-types';
import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { getFullName } from '@/lib/utils';
import TableDropdownMenu from '@/components/table-dropdown';

type EnrolmentsTableProps = {
  courses: CoursesGetType[];
  filterOptions: Record<string, { label: string; value: string }[]>;
};

export default function EnrolmentsTable({
  courses,
  filterOptions,
}: EnrolmentsTableProps) {
  const updatedColumns = useMemo<ColumnDef<CoursesGetType>[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
        cell: info => info.getValue(),
      },
      {
        id: 'instrument',
        header: 'Instrument',
        accessorKey: 'instrument',
        cell: info => info.getValue<CoursesGetType['instrument']>()?.name,
        filterFn: (row, id, filterValue) => {
          const { id: instrumentId } =
            row.getValue<CoursesGetType['instrument']>(id) || {};
          return filterValue.includes(instrumentId);
        },
      },
      {
        id: 'team_member',
        header: 'Instructor',
        accessorFn: row => row.teachers,
        cell: info => {
          return info
            .getValue<CoursesGetType['teachers']>()
            .map(teacher => getFullName(teacher))
            .join(',');
        },
        filterFn: (row, id, filterValue) => {
          const { id: teamMemberID } =
            row.getValue<CoursesGetType['teachers']>(id)[0] || {};
          return filterValue.includes(teamMemberID);
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row: { original } }) => (
          <TableDropdownMenu id={original.id} type={'course'} />
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [],
  );

  return (
    <DataTable
      data={courses}
      columns={updatedColumns}
      filterOptions={filterOptions}
    />
  );
}
