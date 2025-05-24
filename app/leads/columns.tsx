'use client';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { getFullName } from '@/lib/utils';
import { DataTableColumnHeader } from '@/components/data-tables';
import TableDropdownMenu from '@/components/table-dropdown';
import { Badge } from '@/components/ui/badge';
import { InstrumentType, LeadsWithAllInclusions } from '../global-types';

const columnHelper = createColumnHelper<LeadsWithAllInclusions>();

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
  columnHelper.accessor(row => row.team_member?.id as string, {
    id: 'team_member',
    header: 'Team Member',
    cell: info => getFullName(info.row.original.team_member),
    filterFn: (row, id, filterValue) => {
      const teamMemberID = row.getValue<string>(id);
      return filterValue.includes(teamMemberID);
    },
  }),
  columnHelper.accessor(row => row.instruments, {
    id: 'instruments',
    header: 'Instruments',
    cell: info => {
      const instruments = info.getValue() ?? [];
      const displayedInstruments = instruments.slice(0, 2);
      const remainingCount = instruments.length - displayedInstruments.length;

      return (
        <div className="flex gap-1 max-w-lg">
          {displayedInstruments.map(i => (
            <Badge variant="outline" key={i.id}>
              {i.name}
            </Badge>
          ))}
          {remainingCount > 0 && (
            <Badge variant="outline">+{remainingCount} more</Badge>
          )}
        </div>
      );
    },
    filterFn: (row, id, filterValue) => {
      const instruments = row.getValue<InstrumentType[]>(id) ?? [];
      const filterValues = Array.isArray(filterValue)
        ? filterValue
        : [filterValue];
      return instruments.some((instrument: { id: string }) =>
        filterValues.includes(instrument.id),
      );
    },
    enableColumnFilter: true,
    enableSorting: false,
  }) as ColumnDef<LeadsWithAllInclusions, string>,
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: info => <TableDropdownMenu id={info.row.original.id} type={'lead'} />,
    enableSorting: false,
    enableHiding: false,
  }) as ColumnDef<LeadsWithAllInclusions, string>,
];
