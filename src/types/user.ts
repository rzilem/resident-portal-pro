
/**
 * User type definitions for the application
 */

import { DashboardLayout } from './dashboard';
import { PropertyColumn } from '@/components/properties/PropertyColumnsSelector';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  associationIds?: string[];
  createdAt: string;
  lastLogin?: string;
  preferences?: UserPreferences;
  status: 'active' | 'inactive' | 'pending';
}

export type UserRole = 
  | 'admin'
  | 'manager'
  | 'board'
  | 'committee'
  | 'resident'
  | 'guest';

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  cardStyle?: 'default' | 'flat' | 'glass';
  density?: 'comfortable' | 'compact';
  animations?: boolean;
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  calendarView?: 'day' | 'week' | 'month' | 'agenda';
  dashboardLayout?: DashboardLayout;
  dashboardWidgets?: string[];
  propertyTableColumns?: PropertyColumn[];
}
