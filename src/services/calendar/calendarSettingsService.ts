
import { AssociationCalendarSettings } from '@/types/calendar';

// Sample association calendar settings
let associationCalendarSettings: AssociationCalendarSettings[] = [
  {
    associationId: '1',
    name: 'Oak Ridge Community',
    description: 'Calendar for Oak Ridge Community events and meetings',
    defaultAccessLevel: 'residents',
    viewSettings: {
      defaultView: 'month',
      showWeekends: true,
      workdayStart: 9,
      workdayEnd: 17,
      firstDayOfWeek: 0
    },
    color: '#4f46e5',
    enabled: true
  },
  {
    associationId: '2',
    name: 'Meadow Creek HOA',
    description: 'Calendar for Meadow Creek Homeowners Association',
    defaultAccessLevel: 'residents',
    viewSettings: {
      defaultView: 'month',
      showWeekends: true,
      workdayStart: 8,
      workdayEnd: 18,
      firstDayOfWeek: 1
    },
    color: '#0ea5e9',
    enabled: true
  }
];

export const calendarSettingsService = {
  // Get all association calendar settings
  getAllCalendarSettings: () => {
    return associationCalendarSettings;
  },

  // Get calendar settings for a specific association
  getCalendarSettingsByAssociationId: (associationId: string) => {
    const settings = associationCalendarSettings.find(
      settings => settings.associationId === associationId
    );
    
    if (!settings) {
      // If no settings found, return default settings for the association
      const defaultSettings: AssociationCalendarSettings = {
        associationId: associationId,
        name: 'Association Calendar',
        description: 'Default calendar settings',
        defaultAccessLevel: 'residents',
        viewSettings: {
          defaultView: 'month',
          showWeekends: true,
          workdayStart: 9,
          workdayEnd: 17,
          firstDayOfWeek: 0
        },
        color: '#4f46e5',
        enabled: true
      };
      
      // Add the default settings to our collection
      associationCalendarSettings.push(defaultSettings);
      return defaultSettings;
    }
    
    return settings;
  },

  // Update calendar settings
  updateCalendarSettings: (associationId: string, updates: Partial<AssociationCalendarSettings>) => {
    const index = associationCalendarSettings.findIndex(
      settings => settings.associationId === associationId
    );
    
    if (index === -1) {
      // If no settings found, create new settings with the updates
      const newSettings: AssociationCalendarSettings = {
        associationId: associationId,
        name: updates.name || 'Association Calendar',
        description: updates.description || 'Default calendar settings',
        defaultAccessLevel: updates.defaultAccessLevel || 'residents',
        viewSettings: updates.viewSettings || {
          defaultView: 'month',
          showWeekends: true,
          workdayStart: 9,
          workdayEnd: 17,
          firstDayOfWeek: 0
        },
        color: updates.color || '#4f46e5',
        enabled: updates.enabled !== undefined ? updates.enabled : true
      };
      
      associationCalendarSettings.push(newSettings);
      return newSettings;
    }
    
    const updatedSettings = {
      ...associationCalendarSettings[index],
      ...updates
    };
    
    associationCalendarSettings[index] = updatedSettings;
    return updatedSettings;
  },

  // Create calendar settings for a new association
  createCalendarSettings: (settings: AssociationCalendarSettings) => {
    associationCalendarSettings.push(settings);
    return settings;
  }
};
