
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Check, Grid3X3, LayoutGrid, Plus, Settings } from 'lucide-react';
import { Widget, WidgetType } from '@/types/dashboard';
import { cn } from '@/lib/utils';
import { Toggle } from '@/components/ui/toggle';
import { toast } from 'sonner';
import { useCardStyle } from '@/hooks/use-card-style';

interface DashboardCustomizerProps {
  widgets: Widget[];
  columns?: number;
  onSave: (widgets: Widget[], columns?: number) => void;
}

const availableWidgets: Array<{
  type: WidgetType;
  title: string;
  description: string;
}> = [
  { type: 'properties', title: 'Properties', description: 'Overview of your properties' },
  { type: 'residents', title: 'Residents', description: 'Active resident statistics' },
  { type: 'events', title: 'Events', description: 'Upcoming community events' },
  { type: 'activity', title: 'Activity', description: 'Recent activity in your community' },
  { type: 'notifications', title: 'Notifications', description: 'Important alerts and updates' },
  { type: 'weather', title: 'Weather', description: 'Local weather forecast' },
  { type: 'tasks', title: 'Tasks', description: 'Your pending tasks and to-dos' },
  { type: 'maintenance', title: 'Maintenance', description: 'Maintenance requests status' },
  { type: 'financials', title: 'Financials', description: 'Financial overview and reports' },
  { type: 'calendar', title: 'Calendar', description: 'Your upcoming schedule' },
  { type: 'documents', title: 'Documents', description: 'Recently accessed documents' },
  { type: 'announcements', title: 'Announcements', description: 'Community announcements' },
  { type: 'directory', title: 'Directory', description: 'Community directory' },
];

const DashboardCustomizer = ({ widgets, columns = 2, onSave }: DashboardCustomizerProps) => {
  const [currentWidgets, setCurrentWidgets] = useState<Widget[]>(widgets);
  const [columnCount, setColumnCount] = useState(columns);
  const [open, setOpen] = useState(false);
  const { cardClass } = useCardStyle();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(currentWidgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update positions based on new order
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index,
    }));

    setCurrentWidgets(updatedItems);
  };

  const addWidget = (type: WidgetType, title: string) => {
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type,
      title,
      size: 'medium',
      position: currentWidgets.length,
    };

    setCurrentWidgets([...currentWidgets, newWidget]);
  };

  const removeWidget = (id: string) => {
    setCurrentWidgets(currentWidgets.filter(widget => widget.id !== id));
  };

  const toggleWidgetSize = (id: string) => {
    setCurrentWidgets(
      currentWidgets.map(widget => 
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
    setCurrentWidgets(
      currentWidgets.map(widget => 
        widget.id === id 
          ? { ...widget, hidden: !widget.hidden } 
          : widget
      )
    );
  };

  const setColumnLayout = (numColumns: number) => {
    setColumnCount(numColumns);
  };

  const saveChanges = () => {
    onSave(currentWidgets, columnCount);
    setOpen(false);
    toast.success("Dashboard layout saved!");
  };

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
            Drag and drop widgets to rearrange them. Add or remove widgets as needed.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-sm font-medium">Columns:</span>
            <Toggle 
              pressed={columnCount === 1} 
              onPressedChange={() => setColumnLayout(1)}
              aria-label="1 Column"
            >
              <LayoutGrid className="h-4 w-4" />
            </Toggle>
            <Toggle 
              pressed={columnCount === 2} 
              onPressedChange={() => setColumnLayout(2)}
              aria-label="2 Columns"
            >
              <Grid3X3 className="h-4 w-4" />
            </Toggle>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="widgets">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {currentWidgets.map((widget, index) => (
                    <Draggable key={widget.id} draggableId={widget.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={cn(
                            "border rounded-lg p-4 bg-background flex items-center justify-between",
                            widget.hidden && "opacity-60"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-8 h-8 flex items-center justify-center rounded-md",
                              widget.size === 'small' ? "bg-blue-100 dark:bg-blue-900" : 
                              widget.size === 'medium' ? "bg-green-100 dark:bg-green-900" : 
                              "bg-purple-100 dark:bg-purple-900"
                            )}>
                              {widget.size.charAt(0).toUpperCase()}
                            </div>
                            <span>{widget.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => toggleWidgetSize(widget.id)}
                            >
                              {widget.size === 'small' ? 'Small' : 
                               widget.size === 'medium' ? 'Medium' : 'Large'}
                            </Button>
                            <Button 
                              variant={widget.hidden ? "outline" : "ghost"}
                              size="sm"
                              onClick={() => toggleWidgetVisibility(widget.id)}
                            >
                              {widget.hidden ? 'Show' : 'Hide'}
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => removeWidget(widget.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Add Widgets</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {availableWidgets.map((widget) => (
                <Button
                  key={widget.type}
                  variant="outline"
                  className="justify-start h-auto py-2"
                  onClick={() => addWidget(widget.type, widget.title)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <p className="font-medium">{widget.title}</p>
                    <p className="text-xs text-muted-foreground">{widget.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </div>
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
