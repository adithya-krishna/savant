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
    <Alert variant={type === 'error' ? 'destructive' : 'default'}>
      <Icon />
      <AlertTitle>{title}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  );
}
