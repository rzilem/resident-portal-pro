
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { WidgetType } from '@/types/dashboard';

interface AvailableWidgetsProps {
  onAddWidget: (type: WidgetType, title: string) => void;
}

// Available widgets data
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
  { type: 'ci-insights', title: 'CI Insights', description: 'AI-driven community intelligence insights' },
];

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
