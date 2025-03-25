
import { toast } from "sonner";
import { UserPreferences } from "@/types/user";
import { DashboardLayout, Widget } from "@/types/dashboard";

// Mock storage for user settings
let userSettings: Record<string, UserPreferences> = {};

// Initialize with some default settings
const defaultPreferences: UserPreferences = {
  theme: 'light',
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

export const settingsService = {
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

// Company settings
let companySettings: Record<string, any> = {
  companyName: 'Association Management Co.',
  taxId: '12-3456789',
  phone: '(555) 123-4567',
  email: 'contact@associationmgmt.com',
  address: '123 Main St, Suite 100, Cityville, ST 12345',
  description: 'Professional association management services for homeowners and community associations.'
};

export const companySettingsService = {
  /**
   * Get all company settings
   */
  getCompanySettings: () => {
    return { ...companySettings };
  },

  /**
   * Update company settings
   */
  updateCompanySettings: (updates: Record<string, any>) => {
    companySettings = {
      ...companySettings,
      ...updates
    };
    return { ...companySettings };
  },

  /**
   * Update a specific company setting
   */
  updateCompanySetting: (key: string, value: any) => {
    companySettings[key] = value;
    return { ...companySettings };
  }
};

// Integration settings
interface IntegrationSettings {
  enabled: boolean;
  apiKey?: string;
  webhookUrl?: string;
  connectedAccount?: string;
  lastSync?: string;
  config?: Record<string, any>;
}

let integrationSettings: Record<string, Record<string, IntegrationSettings>> = {};

export const integrationService = {
  /**
   * Get all integrations for a user/association
   */
  getIntegrations: (entityId: string) => {
    return integrationSettings[entityId] || {};
  },

  /**
   * Get a specific integration
   */
  getIntegration: (entityId: string, integrationId: string) => {
    if (!integrationSettings[entityId]) {
      return null;
    }
    return integrationSettings[entityId][integrationId] || null;
  },

  /**
   * Connect an integration
   */
  connectIntegration: (
    entityId: string, 
    integrationId: string, 
    settings: IntegrationSettings
  ) => {
    if (!integrationSettings[entityId]) {
      integrationSettings[entityId] = {};
    }
    
    integrationSettings[entityId][integrationId] = {
      ...settings,
      enabled: true,
      lastSync: new Date().toISOString()
    };
    
    return integrationSettings[entityId][integrationId];
  },

  /**
   * Disconnect an integration
   */
  disconnectIntegration: (entityId: string, integrationId: string) => {
    if (!integrationSettings[entityId] || !integrationSettings[entityId][integrationId]) {
      return false;
    }
    
    integrationSettings[entityId][integrationId].enabled = false;
    return true;
  },

  /**
   * Update integration settings
   */
  updateIntegrationSettings: (
    entityId: string, 
    integrationId: string, 
    updates: Partial<IntegrationSettings>
  ) => {
    if (!integrationSettings[entityId] || !integrationSettings[entityId][integrationId]) {
      return null;
    }
    
    integrationSettings[entityId][integrationId] = {
      ...integrationSettings[entityId][integrationId],
      ...updates
    };
    
    return integrationSettings[entityId][integrationId];
  },

  /**
   * Test a webhook integration
   */
  testWebhook: async (url: string, payload: any) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'no-cors',
        body: JSON.stringify(payload)
      });
      
      return true;
    } catch (error) {
      console.error('Error testing webhook:', error);
      return false;
    }
  }
};
