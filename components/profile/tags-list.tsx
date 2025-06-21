'use client';

import { Badge } from '@/components/ui/badge';

interface TagsListProps {
  tags?: string[];
  title?: string;
}

export function TagsList({ tags = [], title = 'Tags' }: TagsListProps) {
  if (!tags.length) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{title}</h3>
      <div className="flex flex-wrap gap-2 pl-2">
        {tags.map(tag => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
