'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertItem as AlertItemType } from '@/app/types/user';
import { AlertItem } from './alert-item';

interface AlertsListProps {
  alerts?: AlertItemType[];
}

export function AlertsList({ alerts = [] }: AlertsListProps) {
  if (!alerts.length) return null;

  return (
    <div className="space-y-2 mt-auto">
      <h3 className="text-sm font-medium">Alerts</h3>
      <ScrollArea className="h-40 pr-2">
        <div className="space-y-2">
          {alerts.map(alert => (
            <AlertItem key={alert.id ?? alert.title} {...alert} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
