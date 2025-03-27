
import React from 'react';
import { Widget } from '@/types/dashboard';
import { DynamicWidget } from './widgets/WidgetRegistry';
import { cn } from '@/lib/utils';
import { useCardStyle } from '@/hooks/use-card-style';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
  widgets: Widget[];
  columns?: number;
  className?: string;
  animate?: boolean;
}

const DashboardLayout = ({ widgets, columns = 2, className, animate = false }: DashboardLayoutProps) => {
  const { cardClass } = useCardStyle();
  
  // Sort widgets by position
  const sortedWidgets = [...widgets].sort((a, b) => a.position - b.position);

  // Filter out hidden widgets
  const visibleWidgets = sortedWidgets.filter(widget => !widget.hidden);

  if (visibleWidgets.length === 0) {
    return (
      <div className="flex justify-center items-center p-8 text-center">
        <div className="max-w-md">
          <h3 className="text-lg font-medium mb-2">No Widgets Available</h3>
          <p className="text-muted-foreground mb-4">
            All widgets are currently hidden. Click the "Customize Dashboard" button to add or show widgets.
          </p>
        </div>
      </div>
    );
  }

  // Animation variants
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div 
      className={cn(
        "grid gap-4",
        columns === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2",
        className
      )}
    >
      {visibleWidgets.map((widget, index) => (
        animate ? (
          <motion.div 
            key={widget.id}
            variants={item}
            className={cn(
              widget.size === 'small' && "col-span-1",
              widget.size === 'medium' && "col-span-1",
              widget.size === 'large' && columns === 2 && "col-span-2",
              "transform-gpu hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            )}
          >
            <DynamicWidget
              type={widget.type}
              size={widget.size}
              config={widget.config}
              cardClass={cn(cardClass, "h-full")}
            />
          </motion.div>
        ) : (
          <div 
            key={widget.id}
            className={cn(
              widget.size === 'small' && "col-span-1",
              widget.size === 'medium' && "col-span-1",
              widget.size === 'large' && columns === 2 && "col-span-2",
              "hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            )}
          >
            <DynamicWidget
              type={widget.type}
              size={widget.size}
              config={widget.config}
              cardClass={cn(cardClass, "h-full")}
            />
          </div>
        )
      ))}
    </div>
  );
};

export default DashboardLayout;
