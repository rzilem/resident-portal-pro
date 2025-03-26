export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  cardStyle: 'default' | 'flat' | 'rounded';
  density: 'comfortable' | 'compact' | 'spacious';
  animations: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  calendarView: 'day' | 'week' | 'month' | 'year';
  dashboardLayout: {
    columns: number;
    widgets: Widget[];
  };
  dashboardWidgets: string[];
  invoiceTableColumns?: InvoiceColumn[];
  vendorTableColumns?: any[];
  databasePropertyColumns?: any[];
  databaseUnitColumns?: any[];
  databaseHomeownerColumns?: any[];
  databaseTransactionColumns?: any[];
}

export interface Widget {
  id: string;
  type: string;
  title: string;
  size: 'small' | 'medium' | 'large';
  position: number;
}

import { InvoiceColumn } from '@/components/accounting/invoices/InvoiceColumnsSelector';
