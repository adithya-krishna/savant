'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from './dt-column-toggle';

import { DataTableFacetedFilter } from './dt-faceted-filter';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterOptions: Record<string, { label: string; value: string }[]>;
}

export function DataTableToolbar<TData>({
  table,
  filterOptions,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter names..."
          value={
            (table.getColumn('full_name')?.getFilterValue() as string) ?? ''
          }
          onChange={event =>
            table.getColumn('full_name')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('stage') && (
          <DataTableFacetedFilter
            column={table.getColumn('stage')}
            title="Stage"
            options={filterOptions.stages}
          />
        )}
        {table.getColumn('instruments') && (
          <DataTableFacetedFilter
            column={table.getColumn('instruments')}
            title="Instruments"
            options={filterOptions.instruments}
          />
        )}
        {table.getColumn('team_member') && (
          <DataTableFacetedFilter
            column={table.getColumn('team_member')}
            title="Team Members"
            options={filterOptions.teamMembers}
          />
        )}
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
