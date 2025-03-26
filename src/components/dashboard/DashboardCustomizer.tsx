
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Check, Settings } from 'lucide-react';
import { Widget, WidgetType } from '@/types/dashboard';
import { useCardStyle } from '@/hooks/use-card-style';
import { useDashboardWidgets } from '@/hooks/use-dashboard-widgets';
import WidgetList from './WidgetList';
import AvailableWidgets from './AvailableWidgets';
import ColumnLayoutSelector from './ColumnLayoutSelector';

interface DashboardCustomizerProps {
  widgets: Widget[];
  columns?: number;
  onSave: (widgets: Widget[], columns?: number) => void;
}

const DashboardCustomizer = ({ widgets, columns = 2, onSave }: DashboardCustomizerProps) => {
  const { cardClass } = useCardStyle();
  const {
    widgets: currentWidgets,
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
  } = useDashboardWidgets({
    initialWidgets: widgets,
    initialColumns: columns,
    onSave
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mb-4">
          <Settings className="h-4 w-4 mr-2" /> Customize Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent className={`max-w-4xl max-h-[80vh] overflow-auto ${cardClass}`}>
        <DialogHeader>
          <DialogTitle>Customize Your Dashboard</DialogTitle>
          <DialogDescription>
            Drag and drop widgets to rearrange them or use the arrow buttons to change their order. Add or remove widgets as needed.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <ColumnLayoutSelector 
            columnCount={columnCount} 
            onColumnChange={setColumnLayout} 
          />

          <WidgetList 
            widgets={currentWidgets}
            onDragEnd={handleDragEnd}
            onRemove={removeWidget}
            onToggleSize={toggleWidgetSize}
            onToggleVisibility={toggleWidgetVisibility}
            onMoveUp={moveWidgetUp}
            onMoveDown={moveWidgetDown}
          />

          <AvailableWidgets onAddWidget={addWidget} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={saveChanges}>
            <Check className="h-4 w-4 mr-2" /> Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardCustomizer;
