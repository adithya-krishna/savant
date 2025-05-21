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
  iconSize = 16,
}: TextWithIconProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-1 text-sm text-muted-foreground',
        className,
      )}
    >
      <Icon
        size={iconSize}
        className="flex items-center shrink-0 text-primary h-[1lh]"
      />
      <span className="whitespace-pre-wrap">{label}</span>
    </div>
  );
}

export default TextWithIcon;
