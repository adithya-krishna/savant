'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from './dt-column-toggle';

import { DataTableFacetedFilter } from './dt-faceted-filter';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterOptions?: Record<string, { label: string; value: string }[]>;
}

export function DataTableToolbar<TData>({
  table,
  filterOptions,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const getOptionalColumn = (id: string) =>
    table.getAllFlatColumns().find(col => col.id === id);

  const filterField =
    getOptionalColumn('full_name') || getOptionalColumn('name');
  const stageFilter = getOptionalColumn('stage');
  const instrumentFilter =
    getOptionalColumn('instruments') || getOptionalColumn('instrument');
  const teamMemberFilter = getOptionalColumn('team_member');

  function getFilters() {
    if (!filterOptions) {
      return null;
    }

    return (
      <>
        {stageFilter && (
          <DataTableFacetedFilter
            column={stageFilter}
            title="Stage"
            options={filterOptions.stages}
          />
        )}
        {instrumentFilter && (
          <DataTableFacetedFilter
            column={instrumentFilter}
            title="Instruments"
            options={filterOptions.instruments}
          />
        )}
        {teamMemberFilter && (
          <DataTableFacetedFilter
            column={teamMemberFilter}
            title="Team Members"
            options={filterOptions.teamMembers}
          />
        )}
      </>
    );
  }

  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter names..."
          value={(filterField?.getFilterValue() as string) ?? ''}
          onChange={event => filterField?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px] bg-card"
        />
        {getFilters()}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
