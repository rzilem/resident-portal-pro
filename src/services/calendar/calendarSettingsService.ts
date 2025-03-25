
import { AssociationCalendarSettings } from '@/types/calendar';

// Sample association calendar settings
let associationCalendarSettings: AssociationCalendarSettings[] = [
  {
    associationId: 'assoc-1',
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
    associationId: 'assoc-2',
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
      throw new Error(`Calendar settings for association ${associationId} not found`);
    }
    
    return settings;
  },

  // Update calendar settings
  updateCalendarSettings: (associationId: string, updates: Partial<AssociationCalendarSettings>) => {
    const index = associationCalendarSettings.findIndex(
      settings => settings.associationId === associationId
    );
    
    if (index === -1) {
      throw new Error(`Calendar settings for association ${associationId} not found`);
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
