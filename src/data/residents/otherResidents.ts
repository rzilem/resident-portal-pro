
import { ResidentProfile } from '@/types/resident';

// Residents with minimal information
const michaelWilson: ResidentProfile = {
  id: 201,
  name: 'Michael Wilson',
  unit: '203',
  property: 'Sunset Gardens',
  email: 'michael.w@example.com',
  phone: '(555) 222-3333',
  status: 'Pending',
  moveInDate: 'Pending Approval',
  balance: '$0.00',
  communications: [],
  notes: [],
  documents: [],
  activityLogs: [],
  propertyDetails: {
    address: '321 Sunset Blvd, San Diego, CA 92101',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 850
  }
};

const sarahBrown: ResidentProfile = {
  id: 202,
  name: 'Sarah Brown',
  unit: '118',
  property: 'Pine Valley Community',
  email: 'sarah.b@example.com',
  phone: '(555) 444-5555',
  status: 'Active',
  moveInDate: '2021-08-15',
  balance: '$0.00',
  communications: [],
  notes: [],
  documents: [],
  activityLogs: [
    { timestamp: '2023-06-11 11:05 AM', activity: 'User logged in', type: 'login', details: 'Device: Edge on Windows' },
    { timestamp: '2023-06-11 11:10 AM', activity: 'Viewed community announcements', type: 'other' },
    { timestamp: '2023-06-11 11:15 AM', activity: 'Sent message to management', type: 'message', details: 'Subject: Pool access question' },
    { timestamp: '2023-06-11 11:25 AM', activity: 'User logged out', type: 'login' },
  ],
  propertyDetails: {
    address: '555 Pine St, Austin, TX 78701',
    bedrooms: 2,
    bathrooms: 1,
    sqft: 1100,
    leaseStart: '2023-01-01',
    leaseEnd: '2023-12-31',
    monthlyAssessment: '$1,300.00',
    deposit: '$1,950.00'
  }
};

const davidMiller: ResidentProfile = {
  id: 301,
  name: 'David Miller',
  unit: '224',
  property: 'Oakwood Heights',
  email: 'david.m@example.com',
  phone: '(555) 666-7777',
  status: 'Inactive',
  moveInDate: '2019-05-10',
  moveOutDate: '2023-05-31',
  balance: '$0.00',
  communications: [],
  notes: [],
  documents: [],
  activityLogs: [],
  propertyDetails: {
    address: '123 Oakwood Dr, Seattle, WA 98101',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 750
  }
};

export { michaelWilson, sarahBrown, davidMiller };
