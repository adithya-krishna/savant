'use client';

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { InfoItem } from '@/app/types/user';

interface InfoTableProps {
  data: InfoItem[];
}

export function InfoTable({ data }: InfoTableProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Details</h3>
      <Table>
        <TableBody>
          {data.map(item => (
            <TableRow key={item.label}>
              <TableCell className="font-medium text-muted-foreground">
                {item.label}
              </TableCell>
              <TableCell className="text-right">{item.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
