
import { useState } from 'react';
import { Widget, WidgetType } from '@/types/dashboard';
import { toast } from 'sonner';

interface UseDashboardWidgetsProps {
  initialWidgets: Widget[];
  initialColumns?: number;
  onSave: (widgets: Widget[], columns?: number) => void;
}

export function useDashboardWidgets({ 
  initialWidgets, 
  initialColumns = 2, 
  onSave 
}: UseDashboardWidgetsProps) {
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);
  const [columnCount, setColumnCount] = useState(initialColumns);
  const [open, setOpen] = useState(false);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update positions based on new order
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index,
    }));

    setWidgets(updatedItems);
  };

  const addWidget = (type: WidgetType, title: string) => {
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type,
      title,
      size: 'medium',
      position: widgets.length,
    };

    setWidgets([...widgets, newWidget]);
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(widget => widget.id !== id));
  };

  const toggleWidgetSize = (id: string) => {
    setWidgets(
      widgets.map(widget => 
        widget.id === id 
          ? { 
              ...widget, 
              size: widget.size === 'small' 
                ? 'medium' 
                : widget.size === 'medium' 
                  ? 'large' 
                  : 'small' 
            } 
          : widget
      )
    );
  };

  const toggleWidgetVisibility = (id: string) => {
    setWidgets(
      widgets.map(widget => 
        widget.id === id 
          ? { ...widget, hidden: !widget.hidden } 
          : widget
      )
    );
  };

  const moveWidgetUp = (index: number) => {
    if (index === 0) return; // Already at the top
    
    const items = Array.from(widgets);
    const [movedItem] = items.splice(index, 1);
    items.splice(index - 1, 0, movedItem);
    
    // Update positions
    const updatedItems = items.map((item, idx) => ({
      ...item,
      position: idx,
    }));
    
    setWidgets(updatedItems);
  };
  
  const moveWidgetDown = (index: number) => {
    if (index === widgets.length - 1) return; // Already at the bottom
    
    const items = Array.from(widgets);
    const [movedItem] = items.splice(index, 1);
    items.splice(index + 1, 0, movedItem);
    
    // Update positions
    const updatedItems = items.map((item, idx) => ({
      ...item,
      position: idx,
    }));
    
    setWidgets(updatedItems);
  };

  const setColumnLayout = (numColumns: number) => {
    setColumnCount(numColumns);
  };

  const saveChanges = () => {
    onSave(widgets, columnCount);
    setOpen(false);
    toast.success("Dashboard layout saved!");
  };

  return {
    widgets,
    columnCount,
    open,
    setOpen,
    handleDragEnd,
    addWidget,
    removeWidget,
    toggleWidgetSize,
    toggleWidgetVisibility,
    moveWidgetUp,
    moveWidgetDown,
    setColumnLayout,
    saveChanges
  };
}
