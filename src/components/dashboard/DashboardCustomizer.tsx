
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Check, Grid3X3, LayoutGrid, Plus, Settings } from 'lucide-react';
import { Widget, WidgetType } from '@/types/dashboard';
import { DynamicWidget } from './widgets/WidgetRegistry';
import { cn } from '@/lib/utils';
import { Toggle } from '@/components/ui/toggle';
import { toast } from 'sonner';

interface DashboardCustomizerProps {
  widgets: Widget[];
  onSave: (widgets: Widget[]) => void;
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

const DashboardCustomizer = ({ widgets, onSave }: DashboardCustomizerProps) => {
  const [currentWidgets, setCurrentWidgets] = useState<Widget[]>(widgets);
  const [columns, setColumns] = useState(2);
  const [open, setOpen] = useState(false);

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

  const saveChanges = () => {
    onSave(currentWidgets);
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
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
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
              pressed={columns === 1} 
              onPressedChange={() => setColumns(1)}
              aria-label="1 Column"
            >
              <LayoutGrid className="h-4 w-4" />
            </Toggle>
            <Toggle 
              pressed={columns === 2} 
              onPressedChange={() => setColumns(2)}
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
                          className="border rounded-lg p-4 bg-background flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-8 h-8 flex items-center justify-center rounded-md",
                              widget.size === 'small' ? "bg-blue-100" : 
                              widget.size === 'medium' ? "bg-green-100" : 
                              "bg-purple-100"
                            )}>
                              {widget.size.charAt(0).toUpperCase()}
                            </div>
                            <span>{widget.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => toggleWidgetSize(widget.id)}
                            >
                              {widget.size === 'small' ? 'Small' : 
                               widget.size === 'medium' ? 'Medium' : 'Large'}
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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
