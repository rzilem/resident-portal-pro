import { ResidentProfiles } from '@/types/resident';

// Mock data for resident profiles
const residentProfiles: ResidentProfiles = {
  101: {
    id: 101,
    name: 'Alice Johnson',
    unit: '301',
    property: 'Oakwood Heights',
    email: 'alice.j@example.com',
    phone: '(555) 123-4567',
    status: 'Active',
    moveInDate: '2021-03-15',
    paymentPreference: 'Auto-pay (Credit Card)',
    balance: '$0.00',
    lastPayment: { date: '2023-06-01', amount: '$1,200.00', method: 'Credit Card' },
    accountHistory: [
      { date: '2023-06-01', description: 'Monthly Assessment Payment', amount: '$1,200.00', balance: '$0.00' },
      { date: '2023-05-15', description: 'Late Fee', amount: '$50.00', balance: '$1,250.00' },
      { date: '2023-05-01', description: 'Monthly Assessment Payment', amount: '$1,200.00', balance: '$0.00' },
      { date: '2023-04-01', description: 'Monthly Assessment Payment', amount: '$1,200.00', balance: '$0.00' },
    ],
    communications: [
      { date: '2023-05-20', type: 'Email', subject: 'Late Payment Reminder', status: 'Delivered' },
      { date: '2023-05-10', type: 'Text Message', subject: 'Payment Due Reminder', status: 'Delivered' },
      { date: '2023-04-15', type: 'Email', subject: 'Community Newsletter', status: 'Opened' },
    ],
    notes: [
      { date: '2023-05-16', author: 'System', content: 'Late payment notice automatically sent' },
      { date: '2023-05-02', author: 'Jane Smith', content: 'Resident called about maintenance request for kitchen sink' },
      { date: '2023-04-10', author: 'John Doe', content: 'Resident mentioned they might renew for another year' },
    ],
    activityLogs: [
      { timestamp: '2023-06-10 09:15 AM', activity: 'User logged in', type: 'login', details: 'Device: Chrome on Windows' },
      { timestamp: '2023-06-10 09:18 AM', activity: 'Viewed payment history', type: 'payment' },
      { timestamp: '2023-06-10 09:22 AM', activity: 'Downloaded HOA guidelines document', type: 'document' },
      { timestamp: '2023-06-10 09:30 AM', activity: 'User logged out', type: 'login' },
      { timestamp: '2023-06-05 02:45 PM', activity: 'User logged in', type: 'login', details: 'Device: Safari on iOS' },
      { timestamp: '2023-06-05 02:50 PM', activity: 'Submitted maintenance request', type: 'request', details: 'Kitchen sink repair' },
      { timestamp: '2023-06-05 03:00 PM', activity: 'User logged out', type: 'login' },
    ],
    documents: [
      { name: 'Lease Agreement', type: 'PDF', date: '2021-03-01', size: '1.2 MB' },
      { name: 'Move-in Inspection', type: 'PDF', date: '2021-03-15', size: '2.4 MB' },
      { name: 'Maintenance Request #103', type: 'PDF', date: '2023-05-02', size: '0.8 MB' },
    ],
    propertyDetails: {
      address: '123 Oakwood Dr, Seattle, WA 98101',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      leaseStart: '2023-01-01',
      leaseEnd: '2023-12-31',
      monthlyAssessment: '$1,200.00',
      deposit: '$1,800.00',
      taxDistrict: 'North Seattle',
      taxId: 'TX-10145-A'
    }
  },
  102: {
    id: 102,
    name: 'Robert Smith',
    unit: '142',
    property: 'Willow Creek Estates',
    email: 'robert.s@example.com',
    phone: '(555) 987-6543',
    status: 'Active',
    moveInDate: '2020-06-10',
    paymentPreference: 'Bank Transfer',
    balance: '$0.00',
    lastPayment: { date: '2023-06-01', amount: '$1,450.00', method: 'Bank Transfer' },
    accountHistory: [
      { date: '2023-06-01', description: 'Monthly Assessment Payment', amount: '$1,450.00', balance: '$0.00' },
      { date: '2023-05-01', description: 'Monthly Assessment Payment', amount: '$1,450.00', balance: '$0.00' },
      { date: '2023-04-01', description: 'Monthly Assessment Payment', amount: '$1,450.00', balance: '$0.00' },
    ],
    communications: [
      { date: '2023-05-15', type: 'Email', subject: 'Community Newsletter', status: 'Opened' },
      { date: '2023-04-25', type: 'Email', subject: 'Maintenance Notification', status: 'Delivered' },
      { date: '2023-04-10', type: 'Text Message', subject: 'Payment Confirmation', status: 'Delivered' },
    ],
    notes: [
      { date: '2023-05-20', author: 'Jane Smith', content: 'Resident inquired about renewing lease' },
      { date: '2023-04-12', author: 'John Doe', content: 'Completed annual unit inspection - all in good condition' },
    ],
    activityLogs: [
      { timestamp: '2023-06-12 10:30 AM', activity: 'User logged in', type: 'login', details: 'Device: Firefox on MacOS' },
      { timestamp: '2023-06-12 10:35 AM', activity: 'Updated contact information', type: 'other' },
      { timestamp: '2023-06-12 10:42 AM', activity: 'Scheduled community event RSVP', type: 'other', details: 'Summer BBQ' },
      { timestamp: '2023-06-12 10:50 AM', activity: 'User logged out', type: 'login' },
    ],
    documents: [
      { name: 'Lease Agreement', type: 'PDF', date: '2020-06-01', size: '1.4 MB' },
      { name: 'Move-in Inspection', type: 'PDF', date: '2020-06-10', size: '2.1 MB' },
      { name: 'Lease Renewal 2022', type: 'PDF', date: '2022-05-15', size: '1.1 MB' },
    ],
    propertyDetails: {
      address: '456 Willow Ave, Portland, OR 97201',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1650,
      leaseStart: '2023-01-01',
      leaseEnd: '2023-12-31',
      monthlyAssessment: '$1,450.00',
      deposit: '$2,175.00',
      taxDistrict: 'Portland Metro',
      taxId: 'PDX-2367'
    }
  },
  103: {
    id: 103,
    name: 'Emily Davis',
    unit: '506',
    property: 'Riverfront Towers',
    email: 'emily.d@example.com',
    phone: '(555) 456-7890',
    status: 'Active',
    moveInDate: '2022-01-05',
    paymentPreference: 'Auto-pay (Credit Card)',
    balance: '$25.00',
    lastPayment: { date: '2023-06-01', amount: '$1,575.00', method: 'Credit Card' },
    accountHistory: [
      { date: '2023-06-01', description: 'Monthly Assessment Payment', amount: '$1,575.00', balance: '$25.00' },
      { date: '2023-05-28', description: 'Maintenance Fee', amount: '$25.00', balance: '$25.00' },
      { date: '2023-05-01', description: 'Monthly Assessment Payment', amount: '$1,575.00', balance: '$0.00' },
    ],
    communications: [],
    notes: [],
    documents: [],
    activityLogs: [
      { timestamp: '2023-06-08 03:15 PM', activity: 'User logged in', type: 'login', details: 'Device: Chrome on Android' },
      { timestamp: '2023-06-08 03:20 PM', activity: 'Made online payment', type: 'payment', details: 'Amount: $1,575.00' },
      { timestamp: '2023-06-08 03:25 PM', activity: 'User logged out', type: 'login' },
    ],
    propertyDetails: {
      address: '789 River Rd, Denver, CO 80201',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1350,
      leaseStart: '2023-01-01',
      leaseEnd: '2023-12-31',
      monthlyAssessment: '$1,575.00',
      deposit: '$2,000.00'
    }
  },
  201: {
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
  },
  202: {
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
  },
  301: {
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
  }
};

export default residentProfiles;
