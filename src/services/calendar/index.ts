
// Re-export all calendar service functionality from a single entry point
import { calendarEvents } from './calendarEvents';
import { calendarEventService } from './calendarEventService';
import { calendarSettingsService } from './calendarSettingsService';
import { workflowEventService } from './workflowEventService';

// Export the complete service with all methods
export const calendarService = {
  ...calendarEventService,
  ...calendarSettingsService,
  ...workflowEventService
};

// Export data for testing or direct access if needed
export { calendarEvents };
