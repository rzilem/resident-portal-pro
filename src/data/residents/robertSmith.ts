
import { ResidentProfile } from '@/types/resident';
import { treasurerTag, landscapingCommitteeTag } from '../tags';

const robertSmith: ResidentProfile = {
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
  },
  tags: [treasurerTag, landscapingCommitteeTag]
};

export default robertSmith;
