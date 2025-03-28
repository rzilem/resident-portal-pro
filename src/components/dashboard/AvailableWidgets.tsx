
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { WidgetType } from '@/types/dashboard';
import { availableWidgets } from './widgetDefinitions';

interface AvailableWidgetsProps {
  onAddWidget: (type: WidgetType, title: string) => void;
}

const AvailableWidgets: React.FC<AvailableWidgetsProps> = ({ onAddWidget }) => {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium mb-2">Add Widgets</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {availableWidgets.map((widget) => (
          <Button
            key={widget.type}
            variant="outline"
            className="justify-start h-auto py-2"
            onClick={() => onAddWidget(widget.type, widget.title)}
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
  );
};

export default AvailableWidgets;
