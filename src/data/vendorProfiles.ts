
import { Vendor, VendorInvoice, VendorService } from '@/types/vendor';
import { v4 as uuidv4 } from 'uuid';

const generateMockInvoices = (vendorId: string, count: number): VendorInvoice[] => {
  const statuses: ('paid' | 'pending' | 'overdue')[] = ['paid', 'pending', 'overdue'];
  const invoices: VendorInvoice[] = [];
  
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i * 15);
    
    const dueDate = new Date(date);
    dueDate.setDate(date.getDate() + 30);
    
    const paymentDate = statuses[i % 3] === 'paid' 
      ? new Date(date.getTime() + (1000 * 60 * 60 * 24 * 25)).toISOString() 
      : undefined;
    
    invoices.push({
      id: uuidv4(),
      invoiceNumber: `INV-${10000 + i}`,
      date: date.toISOString(),
      amount: Math.floor(Math.random() * 5000) + 500,
      status: statuses[i % 3],
      description: `Monthly service - ${date.toLocaleString('default', { month: 'long' })}`,
      dueDate: dueDate.toISOString(),
      paymentDate
    });
  }
  
  return invoices;
};

const generateVendorServices = (count: number): VendorService[] => {
  const services: VendorService[] = [];
  const serviceTypes = ['Landscaping', 'Plumbing', 'Electrical', 'Cleaning', 'Security', 'Maintenance', 'Pool', 'HVAC'];
  const rateTypes: ('hourly' | 'fixed' | 'monthly')[] = ['hourly', 'fixed', 'monthly'];
  
  for (let i = 0; i < count; i++) {
    services.push({
      id: uuidv4(),
      name: `${serviceTypes[i % serviceTypes.length]} Service`,
      description: `Professional ${serviceTypes[i % serviceTypes.length].toLowerCase()} services`,
      rate: Math.floor(Math.random() * 150) + 50,
      rateType: rateTypes[i % rateTypes.length]
    });
  }
  
  return services;
};

export const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Evergreen Landscaping',
    contactName: 'Michael Johnson',
    email: 'mjohnson@evergreen.com',
    phone: '(555) 123-4567',
    address: '123 Pine St, Forestville, CA 94123',
    category: 'Landscaping',
    status: 'active',
    paymentTerms: 'Net 30',
    paymentMethod: 'Check',
    taxId: '12-3456789',
    createdAt: '2022-03-15T08:00:00Z',
    rating: 4.8,
    services: ['Lawn Maintenance', 'Tree Trimming', 'Irrigation'],
    tags: [
      { id: '1', label: 'Landscaping', color: '#65a30d', type: 'service', createdAt: '2022-03-15T08:00:00Z' },
      { id: '2', label: 'Reliable', color: '#0ea5e9', type: 'reliability', createdAt: '2022-03-15T08:00:00Z' }
    ],
    lastInvoiceDate: '2023-06-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Quick Fix Plumbing',
    contactName: 'Sarah Williams',
    email: 'swilliams@quickfix.com',
    phone: '(555) 987-6543',
    address: '456 Water Way, Pipestown, CA 94567',
    category: 'Plumbing',
    status: 'active',
    paymentTerms: 'Net 15',
    paymentMethod: 'ACH Transfer',
    taxId: '98-7654321',
    createdAt: '2021-11-20T09:30:00Z',
    rating: 4.5,
    services: ['Emergency Repairs', 'Pipe Installation', 'Drain Cleaning'],
    tags: [
      { id: '3', label: 'Plumbing', color: '#0d9488', type: 'service', createdAt: '2021-11-20T09:30:00Z' },
      { id: '4', label: 'Emergency', color: '#dc2626', type: 'service', createdAt: '2021-11-20T09:30:00Z' }
    ],
    lastInvoiceDate: '2023-05-15T14:00:00Z'
  },
  {
    id: '3',
    name: 'Bright Spark Electric',
    contactName: 'David Chen',
    email: 'dchen@brightspark.com',
    phone: '(555) 456-7890',
    address: '789 Circuit Ave, Voltburg, CA 95678',
    category: 'Electrical',
    status: 'active',
    paymentTerms: 'Net 30',
    paymentMethod: 'Credit Card',
    taxId: '45-6789012',
    createdAt: '2022-01-10T10:15:00Z',
    rating: 4.7,
    services: ['Wiring', 'Lighting Installation', 'Electrical Inspections'],
    tags: [
      { id: '5', label: 'Electrical', color: '#f97316', type: 'service', createdAt: '2022-01-10T10:15:00Z' },
      { id: '6', label: 'Premium', color: '#9333ea', type: 'pricing', createdAt: '2022-01-10T10:15:00Z' }
    ],
    lastInvoiceDate: '2023-06-05T11:30:00Z'
  },
  {
    id: '4',
    name: 'Crystal Clear Windows',
    contactName: 'Lisa Martinez',
    email: 'lmartinez@crystalclear.com',
    phone: '(555) 234-5678',
    address: '321 Glass Blvd, Windowville, CA 93456',
    category: 'Cleaning',
    status: 'inactive',
    paymentTerms: 'Net 15',
    paymentMethod: 'Check',
    taxId: '34-5678901',
    createdAt: '2022-05-05T11:00:00Z',
    rating: 4.2,
    services: ['Window Cleaning', 'Pressure Washing', 'Gutter Cleaning'],
    tags: [
      { id: '7', label: 'Cleaning', color: '#0ea5e9', type: 'service', createdAt: '2022-05-05T11:00:00Z' },
      { id: '8', label: 'Budget', color: '#16a34a', type: 'pricing', createdAt: '2022-05-05T11:00:00Z' }
    ],
    lastInvoiceDate: '2023-04-22T09:45:00Z'
  },
  {
    id: '5',
    name: 'Guardian Security',
    contactName: 'James Wilson',
    email: 'jwilson@guardian.com',
    phone: '(555) 876-5432',
    address: '567 Safe St, Securetown, CA 96789',
    category: 'Security',
    status: 'active',
    paymentTerms: 'Net 30',
    paymentMethod: 'ACH Transfer',
    taxId: '56-7890123',
    createdAt: '2021-09-15T13:30:00Z',
    rating: 4.9,
    services: ['Alarm Systems', 'Surveillance Cameras', 'Security Patrols'],
    tags: [
      { id: '9', label: 'Security', color: '#dc2626', type: 'service', createdAt: '2021-09-15T13:30:00Z' },
      { id: '10', label: 'Reliable', color: '#0ea5e9', type: 'reliability', createdAt: '2021-09-15T13:30:00Z' }
    ],
    lastInvoiceDate: '2023-06-10T08:15:00Z'
  }
];

// Generate additional data for each vendor
export const getVendorInvoices = (vendorId: string): VendorInvoice[] => {
  return generateMockInvoices(vendorId, 6);
};

export const getVendorServices = (vendorId: string): VendorService[] => {
  return generateVendorServices(3);
};

export default mockVendors;
