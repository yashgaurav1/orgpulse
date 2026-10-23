import React from 'react';
import { SlidingIndicator, TabItem } from '@/components/motion/SlidingIndicator';

export type { TabItem };

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: 'underline' | 'pill';
  className?: string;
}

export function Tabs({
  items,
  activeId,
  onChange,
  variant = 'underline',
  className = '',
}: TabsProps) {
  return (
    <div className={`relative max-w-full overflow-x-auto ${className}`}>
      <SlidingIndicator
        tabs={items}
        activeId={activeId}
        onChange={onChange}
        variant={variant}
      />
    </div>
  );
}
