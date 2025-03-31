
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Widget } from '@/types/dashboard';
import { cn } from '@/lib/utils';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface WidgetListProps {
  widgets: Widget[];
  onDragEnd: (result: any) => void;
  onRemove: (id: string) => void;
  onToggleSize: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

const WidgetList: React.FC<WidgetListProps> = ({
  widgets,
  onDragEnd,
  onRemove,
  onToggleSize,
  onToggleVisibility,
  onMoveUp,
  onMoveDown
}) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="widgets">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {widgets.map((widget, index) => (
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
                      <div className="flex items-center border rounded-md mr-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                disabled={index === 0}
                                onClick={() => onMoveUp(index)}
                                className="h-8 px-2 rounded-none rounded-l-md border-r"
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Move Up</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                disabled={index === widgets.length - 1}
                                onClick={() => onMoveDown(index)}
                                className="h-8 px-2 rounded-none rounded-r-md"
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Move Down</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => onToggleSize(widget.id)}
                            >
                              {widget.size === 'small' ? 'Small' : 
                               widget.size === 'medium' ? 'Medium' : 'Large'}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Change widget size</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant={widget.hidden ? "outline" : "ghost"}
                              size="sm"
                              onClick={() => onToggleVisibility(widget.id)}
                            >
                              {widget.hidden ? 'Show' : 'Hide'}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{widget.hidden ? 'Show widget' : 'Hide widget'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => onRemove(widget.id)}
                            >
                              Remove
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove widget</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
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
  );
};

export default WidgetList;
