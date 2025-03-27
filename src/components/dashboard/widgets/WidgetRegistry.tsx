
import React from 'react';
import { Widget } from '@/types/dashboard';
import CIInsightsWidget from './CIInsightsWidget';
import TasksWidget from './TasksWidget';
import WeatherWidget from './WeatherWidget';
import DocumentsWidget from './DocumentsWidget';
import MaintenanceWidget from './MaintenanceWidget';

// Widget component registry - maps widget types to their corresponding components
const WidgetRegistry: React.FC<{ widget: Widget }> = ({ widget }) => {
  // Wrapper components to adapt widget props to component-specific props
  const widgetComponents: Record<string, React.FC<{ widget: Widget }>> = {
    'tasks': (props) => <TasksWidget 
      size={props.widget.size} 
      cardClass="" 
    />,
    'weather': (props) => <WeatherWidget 
      size={props.widget.size} 
      cardClass="" 
      config={props.widget.config} 
    />,
    'documents': (props) => <DocumentsWidget 
      size={props.widget.size} 
      cardClass="" 
    />,
    'maintenance': (props) => <MaintenanceWidget 
      size={props.widget.size} 
      cardClass="" 
    />,
    'ci-insights': (props) => <CIInsightsWidget 
      widget={props.widget} 
    />,
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

// Export a DynamicWidget component that takes relevant props for the dashboard layout
export const DynamicWidget: React.FC<{
  type: string;
  size: 'small' | 'medium' | 'large';
  config?: Record<string, any>;
  cardClass?: string;
}> = ({ type, size, config, cardClass }) => {
  // Create a mock widget object from the provided props
  const widget: Widget = {
    id: `dynamic-${type}`,
    type: type,
    title: type.charAt(0).toUpperCase() + type.slice(1),
    size: size,
    position: 0,
    config: config
  };

  return <WidgetRegistry widget={widget} />;
};

export default WidgetRegistry;
