
import { UserPreferences } from "@/types/user";

// Mock storage for user settings
let userSettings: Record<string, UserPreferences> = {};

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
  dashboardWidgets: ['tasks', 'calendar', 'notices', 'weather']
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
