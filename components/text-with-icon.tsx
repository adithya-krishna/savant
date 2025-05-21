import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

interface TextWithIconProps {
  icon: LucideIcon;
  label: string;
  className?: string;
  iconSize?: number;
}

function TextWithIcon({
  icon: Icon,
  label,
  className,
  iconSize = 12,
}: TextWithIconProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-2 text-sm/6 text-muted-foreground',
        className,
      )}
    >
      <div className={'flex items-center shrink-0 text-primary h-[24px]'}>
        <Icon size={iconSize} />
      </div>
      <span className="whitespace-pre-wrap">{label}</span>
    </div>
  );
}

export default TextWithIcon;
