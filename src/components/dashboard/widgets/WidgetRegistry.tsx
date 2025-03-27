
import React from 'react';
import { Widget } from '@/types/dashboard';
import CIInsightsWidget from './CIInsightsWidget';
import TasksWidget from './TasksWidget';
import WeatherWidget from './WeatherWidget';
import DocumentsWidget from './DocumentsWidget';
import MaintenanceWidget from './MaintenanceWidget';

// Import additional widget components as needed

// Widget component registry - maps widget types to their corresponding components
const WidgetRegistry: React.FC<{ widget: Widget }> = ({ widget }) => {
  const widgetComponents: Record<string, React.FC<{ widget: Widget }>> = {
    'tasks': TasksWidget,
    'weather': WeatherWidget,
    'documents': DocumentsWidget,
    'maintenance': MaintenanceWidget,
    'ci-insights': CIInsightsWidget,
    // Add more widget mappings as needed
  };

  // Determine which component to render based on widget type
  const WidgetComponent = widgetComponents[widget.type];

  // If widget type exists in registry, render it, otherwise render placeholder
  if (WidgetComponent) {
    return <WidgetComponent widget={widget} />;
  }

  return (
    <div className="border rounded-md p-4 h-full bg-white dark:bg-gray-800">
      <h3 className="font-medium">{widget.title || widget.type}</h3>
      <p className="text-muted-foreground">Widget type: {widget.type}</p>
    </div>
  );
};

export default WidgetRegistry;
