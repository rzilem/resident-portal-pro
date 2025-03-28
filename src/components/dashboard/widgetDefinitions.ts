
import { WidgetType } from '@/types/dashboard';

/**
 * Available widgets data definitions
 */
export const availableWidgets: Array<{
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
  { 
    type: 'ci-insights', 
    title: 'CI Insights', 
    description: 'AI-driven community insights' 
  },
];
