
import React from 'react';
import { cn } from '@/lib/utils';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  rows?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, columns, rows, ...props }, ref) => {
    const getColumnsClass = () => {
      if (!columns) return '';
      
      const classes = [];
      if (columns.xs) classes.push(`grid-cols-${columns.xs}`);
      if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`);
      if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
      if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
      if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);
      
      return classes.join(' ');
    };
    
    const getRowsClass = () => {
      if (!rows) return '';
      
      const classes = [];
      if (rows.xs) classes.push(`grid-rows-${rows.xs}`);
      if (rows.sm) classes.push(`sm:grid-rows-${rows.sm}`);
      if (rows.md) classes.push(`md:grid-rows-${rows.md}`);
      if (rows.lg) classes.push(`lg:grid-rows-${rows.lg}`);
      if (rows.xl) classes.push(`xl:grid-rows-${rows.xl}`);
      
      return classes.join(' ');
    };
    
    return (
      <div 
        ref={ref}
        className={cn('grid', getColumnsClass(), getRowsClass(), className)}
        {...props}
      />
    );
  }
);

Grid.displayName = 'Grid';
