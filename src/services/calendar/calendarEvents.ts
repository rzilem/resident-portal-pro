
import { CalendarEvent } from '@/types/calendar';
import { addDays, subDays, addMonths, setHours, setMinutes } from 'date-fns';

// Current date for reference
const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

// Helper function to get a date in the current month
const getDate = (day: number, hour = 0, minute = 0) => {
  const date = new Date(currentYear, currentMonth, day);
  return setHours(setMinutes(date, minute), hour);
};

// Sample calendar events
export const calendarEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Board Meeting',
    description: 'Monthly board meeting to discuss association business.',
    start: getDate(15, 18, 0), // 15th of current month at 6 PM
    end: getDate(15, 20, 0),   // 15th of current month at 8 PM
    allDay: false,
    location: 'Community Room',
    type: 'meeting',
    associationId: '1',
    accessLevel: 'board',
    createdBy: 'admin'
  },
  {
    id: '2',
    title: 'Community Pool Opening',
    description: 'Seasonal opening of the community pool.',
    start: getDate(1),
    allDay: true,
    location: 'Community Pool',
    type: 'community',
    associationId: '1',
    accessLevel: 'residents'
  },
  {
    id: '3',
    title: 'Landscaping Maintenance',
    description: 'Regular landscaping and grounds maintenance.',
    start: getDate(5, 9, 0),
    end: getDate(5, 17, 0),
    allDay: false,
    location: 'Common Areas',
    type: 'maintenance',
    associationId: '1',
    accessLevel: 'residents'
  },
  {
    id: '4',
    title: 'Annual Dues Deadline',
    description: 'Final day to pay annual HOA dues without late fees.',
    start: getDate(30),
    allDay: true,
    type: 'deadline',
    associationId: '1',
    accessLevel: 'residents'
  },
  {
    id: '5',
    title: 'Holiday - Office Closed',
    description: 'Management office closed for holiday.',
    start: getDate(25),
    allDay: true,
    type: 'holiday',
    associationId: '1',
    accessLevel: 'public'
  },
  {
    id: '6',
    title: 'Violation Review',
    description: 'Review of compliance violations and actions.',
    start: getDate(10, 14, 0),
    end: getDate(10, 16, 0),
    allDay: false,
    location: 'Management Office',
    type: 'workflow',
    associationId: '1',
    accessLevel: 'admin',
    workflowId: 'viol-001'
  },
  {
    id: '7',
    title: 'Community Garage Sale',
    description: 'Annual community-wide garage sale event.',
    start: addDays(getDate(3), 14), // 14 days from the 3rd
    end: addDays(getDate(3), 15),  // 15 days from the 3rd
    allDay: true,
    location: 'All Community',
    type: 'community',
    associationId: '1',
    accessLevel: 'public'
  },
  {
    id: '8',
    title: 'Budget Committee Meeting',
    description: 'Meeting to discuss budget planning for next year.',
    start: getDate(20, 17, 30),
    end: getDate(20, 19, 0),
    allDay: false,
    location: 'Conference Room',
    type: 'meeting',
    associationId: '1',
    accessLevel: 'committee'
  },
  {
    id: '9',
    title: 'Roof Inspection',
    description: 'Annual roof inspection for all buildings.',
    start: subDays(getDate(15), 7),
    end: subDays(getDate(15), 5),
    allDay: true,
    location: 'All Buildings',
    type: 'maintenance',
    associationId: '2',
    accessLevel: 'residents'
  },
  {
    id: '10',
    title: 'New Resident Welcome',
    description: 'Welcome event for new residents.',
    start: addMonths(getDate(5), 1),
    allDay: true,
    location: 'Community Center',
    type: 'community',
    associationId: '1',
    accessLevel: 'residents'
  }
];
