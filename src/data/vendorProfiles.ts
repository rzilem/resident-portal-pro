
import { Vendor } from '@/types/vendor';

const mockVendors: Vendor[] = [
  {
    id: 'v1',
    name: 'ABC Plumbing Services',
    contactName: 'John Smith',
    email: 'john@abcplumbing.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown, USA',
    category: 'Plumbing',
    status: 'active',
    paymentTerms: 'Net 30',
    paymentMethod: 'Check',
    taxId: '12-3456789',
    createdAt: '2023-01-15',
    rating: 4.5,
    services: ['Emergency Repairs', 'Installation', 'Maintenance'],
    tags: [
      { id: 't1', label: 'Reliable', type: 'positive' },
      { id: 't2', label: 'Emergency Service', type: 'info' }
    ],
    lastInvoiceDate: '2023-06-10',
    insurance: {
      policyNumber: 'INS-12345',
      provider: 'SafeGuard Insurance',
      expirationDate: '2023-12-31',
      coverageAmount: 1000000,
      coverageType: 'General Liability'
    }
  },
  {
    id: 'v2',
    name: 'Sunshine Landscaping',
    contactName: 'Mary Johnson',
    email: 'mary@sunshinelandscaping.com',
    phone: '(555) 987-6543',
    address: '456 Oak Ave, Somewhere, USA',
    category: 'Landscaping',
    status: 'active',
    paymentTerms: 'Net 15',
    paymentMethod: 'ACH',
    taxId: '98-7654321',
    createdAt: '2022-11-05',
    rating: 5.0,
    services: ['Lawn Maintenance', 'Tree Trimming', 'Garden Design'],
    tags: [
      { id: 't3', label: 'Punctual', type: 'positive' },
      { id: 't4', label: 'Quality Work', type: 'positive' }
    ],
    lastInvoiceDate: '2023-05-22'
  },
  {
    id: 'v3',
    name: 'ElectraTech Solutions',
    contactName: 'David Wilson',
    email: 'david@electratech.com',
    phone: '(555) 234-5678',
    address: '789 Elm Blvd, Nowhere, USA',
    category: 'Electrical',
    status: 'active',
    paymentTerms: 'Net 30',
    paymentMethod: 'Credit Card',
    taxId: '45-6789012',
    createdAt: '2022-09-20',
    rating: 4.2,
    services: ['Wiring Installation', 'Panel Upgrades', 'Safety Inspections'],
    tags: [
      { id: 't5', label: 'Certified', type: 'info' }
    ],
    lastInvoiceDate: '2023-06-15'
  },
  {
    id: 'v4',
    name: 'Clean & Clear Windows',
    contactName: 'Sarah Thompson',
    email: 'sarah@cleanandclear.com',
    phone: '(555) 345-6789',
    address: '101 Pine St, Anywhere, USA',
    category: 'Window Cleaning',
    status: 'inactive',
    paymentTerms: 'Net 15',
    paymentMethod: 'Check',
    taxId: '56-7890123',
    createdAt: '2023-02-10',
    rating: 3.8,
    lastInvoiceDate: '2023-04-05'
  },
  {
    id: 'v5',
    name: 'Superior HVAC',
    contactName: 'Michael Brown',
    email: 'michael@superiorhvac.com',
    phone: '(555) 456-7890',
    address: '202 Maple Dr, Elsewhere, USA',
    category: 'HVAC',
    status: 'active',
    paymentTerms: 'Net 30',
    paymentMethod: 'ACH',
    taxId: '67-8901234',
    createdAt: '2022-07-15',
    rating: 4.7,
    services: ['Installation', 'Repairs', 'Maintenance'],
    tags: [
      { id: 't6', label: '24/7 Service', type: 'info' },
      { id: 't7', label: 'Warranty', type: 'positive' }
    ],
    lastInvoiceDate: '2023-06-01'
  },
  {
    id: 'v6',
    name: 'Fresh Paint Pro',
    contactName: 'Jennifer Lee',
    email: 'jennifer@freshpaintpro.com',
    phone: '(555) 567-8901',
    address: '303 Cedar Ln, Someplace, USA',
    category: 'Painting',
    status: 'active',
    paymentTerms: 'Net 15',
    paymentMethod: 'Check',
    taxId: '78-9012345',
    createdAt: '2023-03-20',
    rating: 4.9,
    services: ['Interior Painting', 'Exterior Painting', 'Color Consultation'],
    tags: [
      { id: 't8', label: 'Eco-Friendly', type: 'positive' }
    ],
    lastInvoiceDate: '2023-05-15'
  },
  {
    id: 'v7',
    name: 'SafeGuard Security',
    contactName: 'Robert Garcia',
    email: 'robert@safeguardsecurity.com',
    phone: '(555) 678-9012',
    address: '404 Birch Rd, Othertown, USA',
    category: 'Security',
    status: 'active',
    paymentTerms: 'Net 30',
    paymentMethod: 'ACH',
    taxId: '89-0123456',
    createdAt: '2022-10-10',
    rating: 4.6,
    services: ['System Installation', 'Monitoring', 'Maintenance'],
    tags: [
      { id: 't9', label: 'Licensed', type: 'info' },
      { id: 't10', label: 'Insured', type: 'info' }
    ],
    lastInvoiceDate: '2023-06-05'
  },
  {
    id: 'v8',
    name: 'Green Thumb Gardening',
    contactName: 'Lisa Mitchell',
    email: 'lisa@greenthumb.com',
    phone: '(555) 789-0123',
    address: '505 Willow Way, Somewhere, USA',
    category: 'Gardening',
    status: 'inactive',
    paymentTerms: 'Net 15',
    paymentMethod: 'Check',
    taxId: '90-1234567',
    createdAt: '2022-04-15',
    rating: 3.5,
    lastInvoiceDate: '2022-10-20'
  }
];

export default mockVendors;
