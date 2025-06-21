'use client';

import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertItem as AlertItemType } from '@/app/types/user';
import { cn } from '@/lib/utils';

const iconMap = {
  info: Info,
  success: CheckCircle,
  error: AlertCircle,
};

export function AlertItem({ type, title, description }: AlertItemType) {
  const Icon = iconMap[type];
  return (
    <Alert
      className={cn(
        'border-l-4',
        type === 'info' && 'border-blue-500',
        type === 'success' && 'border-green-500',
        type === 'error' && 'border-red-500',
      )}
    >
      <Icon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  );
}
