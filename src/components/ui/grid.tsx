
import React from 'react';
import { cn } from '@/lib/utils';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  columns?: number;
  gap?: number;
  className?: string;
}

export const Grid = ({
  children,
  columns = 3,
  gap = 6,
  className,
  ...props
}: GridProps) => {
  return (
    <div
      className={cn(
        `grid grid-cols-1 md:grid-cols-${columns} gap-${gap}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
