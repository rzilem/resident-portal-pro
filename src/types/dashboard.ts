
/**
 * Dashboard widget type definitions
 */

export type WidgetType = 
  | 'properties'
  | 'residents'
  | 'events'
  | 'activity'
  | 'notifications'
  | 'weather'
  | 'tasks'
  | 'maintenance'
  | 'financials'
  | 'calendar'
  | 'documents'
  | 'announcements'
  | 'directory'
  | 'ci-insights'
  | string; // Add string to make it compatible with the User Widget type

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  size: 'small' | 'medium' | 'large';
  position: number;
  hidden?: boolean;
  config?: Record<string, any>;
}

export interface DashboardLayout {
  columns: number;
  widgets: Widget[];
}
