
import React from 'react';
import { cn } from '@/lib/utils';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  columns?: number | { sm?: number; md?: number; lg?: number };
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
  // Handle responsive columns
  let columnsClass = '';
  
  if (typeof columns === 'number') {
    columnsClass = `grid-cols-1 md:grid-cols-${columns}`;
  } else {
    // Default to grid-cols-1 for mobile
    columnsClass = 'grid-cols-1';
    
    // Add responsive breakpoints if specified
    if (columns.sm) {
      columnsClass += ` sm:grid-cols-${columns.sm}`;
    }
    if (columns.md) {
      columnsClass += ` md:grid-cols-${columns.md}`;
    }
    if (columns.lg) {
      columnsClass += ` lg:grid-cols-${columns.lg}`;
    }
  }

  return (
    <div
      className={cn(
        `grid ${columnsClass} gap-${gap}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
