
import { ResidentProfile } from '@/types/resident';
import { delinquentTag } from '../tags';

const emilyDavis: ResidentProfile = {
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
  },
  tags: [delinquentTag]
};

export default emilyDavis;
