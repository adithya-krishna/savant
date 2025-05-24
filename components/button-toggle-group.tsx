'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

type allowedTypes = string | number | Date;

type Item<T extends allowedTypes> = {
  id: T;
  label: string;
};

type ButtonToggleGroupProps<T extends allowedTypes> = {
  items: Item<T>[];
};

function ButtonToggleGroup<T extends allowedTypes>({
  items,
}: ButtonToggleGroupProps<T>) {
  const [selectedIds, setSelectedIds] = useState<T[]>([]);

  const toggleSelection = (id: T) => {
    setSelectedIds(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(itemId => itemId !== id)
        : [...prevSelected, id],
    );
  };

  return (
    <div className="flex gap-2">
      {items.map((item, i) => (
        <Button
          key={item.label + i}
          onClick={() => toggleSelection(item.id)}
          variant={`${selectedIds.includes(item.id) ? 'default' : 'outline'}`}
          className="cursor-pointer"
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}

export default ButtonToggleGroup;
