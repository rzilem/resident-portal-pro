
import { UserPreferences } from "@/types/user";
import { InvoiceColumn } from "@/components/accounting/invoices/InvoiceColumnsSelector";

// Mock storage for user settings
let userSettings: Record<string, UserPreferences> = {};

// Default invoice columns
const defaultInvoiceColumns: InvoiceColumn[] = [
  { id: 'invoiceNumber', label: 'Invoice #', checked: true },
  { id: 'date', label: 'Date', checked: true },
  { id: 'dueDate', label: 'Due Date', checked: true },
  { id: 'vendor', label: 'Vendor', checked: true },
  { id: 'association', label: 'Association', checked: true },
  { id: 'amount', label: 'Amount', checked: true },
  { id: 'status', label: 'Status', checked: true },
  { id: 'recipient', label: 'Recipient', checked: false },
  { id: 'category', label: 'Category', checked: false },
  { id: 'createdAt', label: 'Created', checked: false }
];

// Initialize with some default settings
const defaultPreferences: UserPreferences = {
  theme: 'light',
  cardStyle: 'default',
  density: 'comfortable',
  animations: true,
  notifications: {
    email: true,
    push: true,
    sms: false
  },
  calendarView: 'month',
  dashboardLayout: {
    columns: 2,
    widgets: [
      {
        id: 'widget-1',
        type: 'tasks',
        title: 'Tasks',
        size: 'medium',
        position: 0,
      },
      {
        id: 'widget-2',
        type: 'calendar',
        title: 'Calendar',
        size: 'medium',
        position: 1,
      },
      {
        id: 'widget-3',
        type: 'notifications',
        title: 'Notifications',
        size: 'small',
        position: 2,
      },
      {
        id: 'widget-4',
        type: 'weather',
        title: 'Weather',
        size: 'small',
        position: 3,
      },
    ]
  },
  dashboardWidgets: ['tasks', 'calendar', 'notices', 'weather'],
  invoiceTableColumns: defaultInvoiceColumns
};

export const userPreferencesService = {
  /**
   * Get user preferences for a specific user
   */
  getUserPreferences: (userId: string): UserPreferences => {
    if (!userSettings[userId]) {
      userSettings[userId] = { ...defaultPreferences };
    }
    return userSettings[userId];
  },

  /**
   * Update user preferences
   */
  updateUserPreferences: (userId: string, updates: Partial<UserPreferences>): UserPreferences => {
    if (!userSettings[userId]) {
      userSettings[userId] = { ...defaultPreferences };
    }

    userSettings[userId] = {
      ...userSettings[userId],
      ...updates
    };

    return userSettings[userId];
  },

  /**
   * Update a specific preference
   */
  updatePreference: (userId: string, key: keyof UserPreferences, value: any): UserPreferences => {
    if (!userSettings[userId]) {
      userSettings[userId] = { ...defaultPreferences };
    }

    userSettings[userId] = {
      ...userSettings[userId],
      [key]: value
    };

    return userSettings[userId];
  },

  /**
   * Reset user preferences to default
   */
  resetPreferences: (userId: string): UserPreferences => {
    userSettings[userId] = { ...defaultPreferences };
    return userSettings[userId];
  }
};
