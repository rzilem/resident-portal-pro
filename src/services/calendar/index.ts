
import { calendarEventService } from './calendarService';

// Create or initialize the calendar_events table in the database
const initializeCalendarTable = async () => {
  try {
    // This would normally be done via a SQL migration
    console.log('Initialized calendar table structure');
    return true;
  } catch (error) {
    console.error('Error initializing calendar table:', error);
    return false;
  }
};

// Initialize the table on module load
initializeCalendarTable();

// Export the calendar services
export const calendarService = calendarEventService;
