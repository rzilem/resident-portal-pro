
import React from 'react';
import { WidgetType } from '@/types/dashboard';
import { Card } from '@/components/ui/card';

// Import all widget components
import WeatherWidget from './WeatherWidget';
import TasksWidget from './TasksWidget';
import MaintenanceWidget from './MaintenanceWidget';
import DocumentsWidget from './DocumentsWidget';

// Create a placeholder widget component
const PlaceholderWidget = ({ title, size, cardClass }: { title: string; size?: string; cardClass?: string }) => (
  <Card className={`p-4 h-full ${cardClass}`}>
    <div className="flex flex-col items-center justify-center h-full min-h-[150px] text-center p-4">
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">
        {size === 'small' ? 'Small' : size === 'large' ? 'Large' : 'Medium'} widget
      </p>
    </div>
  </Card>
);

// This will map widget types to their respective components
export const widgetComponents: Record<WidgetType, React.ComponentType<any>> = {
  'weather': WeatherWidget,
  'tasks': TasksWidget,
  'maintenance': MaintenanceWidget,
  'documents': DocumentsWidget,
  
  // Placeholder for other widget types
  'properties': ({ cardClass, size }: { cardClass?: string, size?: 'small' | 'medium' | 'large' }) => 
    <PlaceholderWidget title="Properties Widget" cardClass={cardClass} size={size} />,
  'residents': ({ cardClass, size }: { cardClass?: string, size?: 'small' | 'medium' | 'large' }) => 
    <PlaceholderWidget title="Residents Widget" cardClass={cardClass} size={size} />,
  'events': ({ cardClass, size }: { cardClass?: string, size?: 'small' | 'medium' | 'large' }) => 
    <PlaceholderWidget title="Events Widget" cardClass={cardClass} size={size} />,
  'activity': ({ cardClass, size }: { cardClass?: string, size?: 'small' | 'medium' | 'large' }) => 
    <PlaceholderWidget title="Activity Widget" cardClass={cardClass} size={size} />,
  'notifications': ({ cardClass, size }: { cardClass?: string, size?: 'small' | 'medium' | 'large' }) => 
    <PlaceholderWidget title="Notifications Widget" cardClass={cardClass} size={size} />,
  'financials': ({ cardClass, size }: { cardClass?: string, size?: 'small' | 'medium' | 'large' }) => 
    <PlaceholderWidget title="Financials Widget" cardClass={cardClass} size={size} />,
  'calendar': ({ cardClass, size }: { cardClass?: string, size?: 'small' | 'medium' | 'large' }) => 
    <PlaceholderWidget title="Calendar Widget" cardClass={cardClass} size={size} />,
  'announcements': ({ cardClass, size }: { cardClass?: string, size?: 'small' | 'medium' | 'large' }) => 
    <PlaceholderWidget title="Announcements Widget" cardClass={cardClass} size={size} />,
  'directory': ({ cardClass, size }: { cardClass?: string, size?: 'small' | 'medium' | 'large' }) => 
    <PlaceholderWidget title="Directory Widget" cardClass={cardClass} size={size} />,
};

interface DynamicWidgetProps {
  type: WidgetType;
  size?: 'small' | 'medium' | 'large';
  config?: Record<string, any>;
  cardClass?: string;
}

// A component that renders the appropriate widget based on the type
export const DynamicWidget = ({ type, size = 'medium', config = {}, cardClass = '' }: DynamicWidgetProps) => {
  const WidgetComponent = widgetComponents[type] || (({ cardClass, size }: { cardClass?: string, size?: 'small' | 'medium' | 'large' }) => 
    <Card className={`p-4 ${cardClass}`}>Widget not found</Card>);
  
  return <WidgetComponent size={size} cardClass={cardClass} {...config} />;
};
