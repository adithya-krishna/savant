import TextWithIcon from '@/components/text-with-icon';
import { Progress } from '@/components/ui/progress';
import { Users } from 'lucide-react';

export default function SlotItem({
  time,
  maxCap,
  count,
}: {
  time: string;
  maxCap: number;
  count: number;
}) {
  const val = Math.round((count / maxCap) * 100);
  return (
    <div className="flex flex-col bg-card shadow-md rounded-md p-4">
      <h4 className="text-sm font-semibold">{time}</h4>
      <TextWithIcon icon={Users} label={`${count}/${maxCap}`} />
      <Progress value={val} className="mt-4" />
    </div>
  );
}
