
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Check, Settings } from 'lucide-react';
import { Widget, WidgetType } from '@/types/dashboard';
import { useCardStyle } from '@/hooks/use-card-style';
import { useDashboardWidgets } from '@/hooks/use-dashboard-widgets';
import WidgetList from './WidgetList';
import AvailableWidgets from './AvailableWidgets';
import ColumnLayoutSelector from './ColumnLayoutSelector';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface DashboardCustomizerProps {
  widgets: Widget[];
  columns?: number;
  onSave: (widgets: Widget[], columns?: number) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DashboardCustomizer = ({
  widgets,
  columns = 2,
  onSave,
  open,
  onOpenChange
}: DashboardCustomizerProps) => {
  const {
    cardClass
  } = useCardStyle();
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    widgets: currentWidgets,
    columnCount,
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
    onSave: (updatedWidgets, updatedColumns) => {
      onSave(updatedWidgets, updatedColumns);
      if (onOpenChange) {
        onOpenChange(false);
      } else {
        setDialogOpen(false);
      }
    }
  });
  
  // Use controlled or uncontrolled open state
  const isOpen = open !== undefined ? open : dialogOpen;
  const handleOpenChange = onOpenChange || setDialogOpen;
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className={`max-w-4xl max-h-[80vh] overflow-auto ${cardClass}`}>
        <DialogHeader>
          <DialogTitle>Customize Your Dashboard</DialogTitle>
          <DialogDescription>
            Drag and drop widgets to rearrange them or use the arrow buttons to change their order. Add or remove widgets as needed.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <ColumnLayoutSelector columnCount={columnCount} onColumnChange={setColumnLayout} />

          <WidgetList widgets={currentWidgets} onDragEnd={handleDragEnd} onRemove={removeWidget} onToggleSize={toggleWidgetSize} onToggleVisibility={toggleWidgetVisibility} onMoveUp={moveWidgetUp} onMoveDown={moveWidgetDown} />

          <AvailableWidgets onAddWidget={addWidget} />
        </div>

        <DialogFooter>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={() => handleOpenChange(false)}>
                  Cancel
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Discard changes</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={saveChanges}>
                  <Check className="h-4 w-4 mr-2" /> Save Changes
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Save dashboard layout</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardCustomizer;
