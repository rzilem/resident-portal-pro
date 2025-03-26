
import { ResidentProfile } from '@/types/resident';
import { v4 as uuidv4 } from 'uuid';
import { boardMemberTag, newResidentTag, delinquentTag, violationTag, arcPendingTag } from '../tags';

const aliceJohnson: ResidentProfile = {
  id: 101,
  name: 'Alice Johnson',
  unit: '301',
  property: 'Oakwood Heights',
  email: 'alice.j@example.com',
  phone: '(555) 123-4567',
  status: 'Active',
  moveInDate: '2021-03-15',
  paymentPreference: 'Auto-pay (Credit Card)',
  balance: '$1,250.00', // Updated with a balance
  lastPayment: { date: '2023-06-01', amount: '$1,200.00', method: 'Credit Card' },
  accountHistory: [
    { date: '2023-06-01', description: 'Monthly Assessment Payment', amount: '$1,200.00', balance: '$1,250.00' },
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
  },
  tags: [boardMemberTag, newResidentTag, delinquentTag, violationTag, arcPendingTag],
  violations: [
    {
      id: uuidv4(),
      date: '2023-05-28',
      type: 'Landscaping',
      description: 'Overgrown lawn and shrubs',
      status: 'Open',
      dueDate: '2023-06-15'
    }
  ],
  arcApplications: [
    {
      id: uuidv4(),
      submittedDate: '2023-06-01',
      projectType: 'Exterior Paint',
      description: 'Change exterior color to light grey with white trim',
      status: 'Pending',
      reviewDate: '2023-06-20'
    }
  ],
  lastContact: {
    called: '2023-06-05',
    visitedOffice: '2023-05-20',
    email: '2023-06-02'
  }
};

export default aliceJohnson;
