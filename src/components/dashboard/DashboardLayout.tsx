
import React from 'react';
import { Widget } from '@/types/dashboard';
import { DynamicWidget } from './widgets/WidgetRegistry';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  widgets: Widget[];
  columns?: number;
}

const DashboardLayout = ({ widgets, columns = 2 }: DashboardLayoutProps) => {
  // Sort widgets by position
  const sortedWidgets = [...widgets].sort((a, b) => a.position - b.position);

  // Filter out hidden widgets
  const visibleWidgets = sortedWidgets.filter(widget => !widget.hidden);

  return (
    <div 
      className={cn(
        "grid gap-4",
        columns === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
      )}
    >
      {visibleWidgets.map((widget) => (
        <div 
          key={widget.id}
          className={cn(
            widget.size === 'small' && "col-span-1",
            widget.size === 'medium' && "col-span-1",
            widget.size === 'large' && columns === 2 && "col-span-2"
          )}
        >
          <DynamicWidget
            type={widget.type}
            size={widget.size}
            config={widget.config}
          />
        </div>
      ))}
    </div>
  );
};

export default DashboardLayout;
