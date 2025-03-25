
import { Association } from './types';

// Mock data for associations and owners
export const associationsData: Association[] = [
  {
    id: 1,
    name: 'Oakwood Heights HOA',
    location: 'Seattle, WA',
    owners: [
      { id: 101, name: 'Alice Johnson', unit: '301', email: 'alice.j@example.com' },
      { id: 102, name: 'Robert Smith', unit: '142', email: 'robert.s@example.com' },
      { id: 103, name: 'Emily Davis', unit: '506', email: 'emily.d@example.com' },
    ]
  },
  {
    id: 2,
    name: 'Willow Creek Estates',
    location: 'Portland, OR',
    owners: [
      { id: 201, name: 'Michael Wilson', unit: '203', email: 'michael.w@example.com' },
      { id: 202, name: 'Sarah Brown', unit: '118', email: 'sarah.b@example.com' },
    ]
  },
  {
    id: 3,
    name: 'Riverfront Towers',
    location: 'Denver, CO',
    owners: [
      { id: 301, name: 'David Miller', unit: '224', email: 'david.m@example.com' },
      { id: 302, name: 'Jennifer Lee', unit: '315', email: 'jennifer.l@example.com' },
      { id: 303, name: 'Thomas Clark', unit: '410', email: 'thomas.c@example.com' },
    ]
  },
  {
    id: 4,
    name: 'Sunset Gardens',
    location: 'San Diego, CA',
    owners: [
      { id: 401, name: 'Lisa Adams', unit: '105', email: 'lisa.a@example.com' },
      { id: 402, name: 'James Wilson', unit: '221', email: 'james.w@example.com' },
    ]
  },
  {
    id: 5,
    name: 'Pine Valley Community',
    location: 'Austin, TX',
    owners: [
      { id: 501, name: 'Patricia Moore', unit: '112', email: 'patricia.m@example.com' },
      { id: 502, name: 'Richard Taylor', unit: '304', email: 'richard.t@example.com' },
      { id: 503, name: 'Michelle Garcia', unit: '216', email: 'michelle.g@example.com' },
    ]
  },
];
