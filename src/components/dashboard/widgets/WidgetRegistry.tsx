
import React from 'react';
import { WidgetType } from '@/types/dashboard';
import { Card } from '@/components/ui/card';

// Import all widget components
import WeatherWidget from './WeatherWidget';
import TasksWidget from './TasksWidget';
import MaintenanceWidget from './MaintenanceWidget';
import DocumentsWidget from './DocumentsWidget';

// This will map widget types to their respective components
export const widgetComponents: Record<WidgetType, React.ComponentType<any>> = {
  'weather': WeatherWidget,
  'tasks': TasksWidget,
  'maintenance': MaintenanceWidget,
  'documents': DocumentsWidget,
  
  // Placeholder for other widget types
  'properties': () => <Card className="p-4">Properties Widget</Card>,
  'residents': () => <Card className="p-4">Residents Widget</Card>,
  'events': () => <Card className="p-4">Events Widget</Card>,
  'activity': () => <Card className="p-4">Activity Widget</Card>,
  'notifications': () => <Card className="p-4">Notifications Widget</Card>,
  'financials': () => <Card className="p-4">Financials Widget</Card>,
  'calendar': () => <Card className="p-4">Calendar Widget</Card>,
  'announcements': () => <Card className="p-4">Announcements Widget</Card>,
  'directory': () => <Card className="p-4">Directory Widget</Card>,
};

interface DynamicWidgetProps {
  type: WidgetType;
  size?: 'small' | 'medium' | 'large';
  config?: Record<string, any>;
}

// A component that renders the appropriate widget based on the type
export const DynamicWidget = ({ type, size = 'medium', config = {} }: DynamicWidgetProps) => {
  const WidgetComponent = widgetComponents[type] || (() => <Card>Widget not found</Card>);
  return <WidgetComponent size={size} {...config} />;
};
