
import { Association } from '@/types/association';

export interface Property {
  name: string;
  type: string;
  units: string;
  location: string;
  city: string;
  county: string;
  taxId: string;
  hasPool: boolean;
  hasGate: boolean;
  hasPedestrianGate: boolean;
  status: string;
  foundedDate: string;
  annualFees: string;
  manager: string;
  contactEmail: string;
  contactPhone: string;
  residents: string;
  offsiteAddresses: string;
  leases: string;
  serviceType: string;
  assessmentFrequency: string;
}

export const getPropertiesFromAssociations = (associations: Association[]): Property[] => {
  if (!associations || associations.length === 0) {
    return [];
  }
  
  return associations.map(association => ({
    name: association.name,
    type: association.type,
    units: association.units.toString(),
    location: `${association.address.city}, ${association.address.state}`,
    city: association.address.city,
    county: association.settings?.county || '',
    taxId: association.settings?.taxId || '',
    hasPool: association.settings?.hasPool || false,
    hasGate: association.settings?.hasGate || false,
    hasPedestrianGate: association.settings?.hasPedestrianGate || false,
    status: association.status,
    foundedDate: association.foundedDate,
    annualFees: association.settings?.annualFees || '',
    manager: association.settings?.manager || '',
    contactEmail: association.contactInfo.email,
    contactPhone: association.contactInfo.phone,
    residents: association.settings?.residents || '',
    offsiteAddresses: association.settings?.offsiteAddresses || '',
    leases: association.settings?.leases || '',
    serviceType: association.settings?.serviceType || '',
    assessmentFrequency: association.settings?.feesFrequency || 'monthly'
  }));
};

export const getDefaultProperties = (): Property[] => [
  { 
    name: 'Oakwood Heights', 
    type: 'Condominium', 
    units: '48', 
    location: 'Seattle, WA',
    city: 'Seattle',
    county: 'King',
    taxId: 'TX-12345',
    hasPool: true,
    hasGate: true,
    hasPedestrianGate: false,
    status: 'Active',
    foundedDate: '2010-05-14',
    annualFees: '$125,000',
    manager: 'John Smith',
    contactEmail: 'info@oakwoodheights.com',
    contactPhone: '(206) 555-1234',
    residents: '112',
    offsiteAddresses: '6',
    leases: '12',
    serviceType: 'Full-Service',
    assessmentFrequency: 'Monthly'
  },
  { 
    name: 'Willow Creek Estates', 
    type: 'HOA', 
    units: '86', 
    location: 'Portland, OR',
    city: 'Portland',
    county: 'Multnomah',
    taxId: 'TX-23456',
    hasPool: true,
    hasGate: false,
    hasPedestrianGate: true,
    status: 'Active',
    foundedDate: '2008-09-22',
    annualFees: '$215,000',
    manager: 'Sarah Johnson',
    contactEmail: 'info@willowcreek.org',
    contactPhone: '(503) 555-6789',
    residents: '192',
    offsiteAddresses: '14',
    leases: '25',
    serviceType: 'Self-Managed',
    assessmentFrequency: 'Quarterly'
  },
  { 
    name: 'Riverfront Towers', 
    type: 'Condominium', 
    units: '64', 
    location: 'Denver, CO',
    city: 'Denver',
    county: 'Denver',
    taxId: 'TX-34567',
    hasPool: true,
    hasGate: true,
    hasPedestrianGate: true,
    status: 'Active',
    foundedDate: '2015-03-15',
    annualFees: '$176,000',
    manager: 'Michael Brown',
    contactEmail: 'info@riverfronttowers.com',
    contactPhone: '(303) 555-4321',
    residents: '143',
    offsiteAddresses: '8',
    leases: '17',
    serviceType: 'Full-Service',
    assessmentFrequency: 'Monthly'
  },
  { 
    name: 'Sunset Gardens', 
    type: 'HOA', 
    units: '32', 
    location: 'San Diego, CA',
    city: 'San Diego',
    county: 'San Diego',
    taxId: 'TX-45678',
    hasPool: false,
    hasGate: false,
    hasPedestrianGate: false,
    status: 'Maintenance',
    foundedDate: '2012-07-08',
    annualFees: '$78,000',
    manager: 'Emily Wilson',
    contactEmail: 'info@sunsetgardens.org',
    contactPhone: '(619) 555-8765',
    residents: '76',
    offsiteAddresses: '3',
    leases: '7',
    serviceType: 'Partial',
    assessmentFrequency: 'Annually'
  },
  { 
    name: 'Pine Valley Community', 
    type: 'HOA', 
    units: '26', 
    location: 'Austin, TX',
    city: 'Austin',
    county: 'Travis',
    taxId: 'TX-56789',
    hasPool: false,
    hasGate: true,
    hasPedestrianGate: false,
    status: 'Active',
    foundedDate: '2018-11-29',
    annualFees: '$62,000',
    manager: 'Robert Lee',
    contactEmail: 'info@pinevalley.org',
    contactPhone: '(512) 555-3456',
    residents: '58',
    offsiteAddresses: '2',
    leases: '5',
    serviceType: 'Self-Managed',
    assessmentFrequency: 'Quarterly'
  }
];

export const getDefaultColumns = () => [
  { id: 'name', label: 'Property Name', checked: true },
  { id: 'type', label: 'Type', checked: true },
  { id: 'units', label: 'Units', checked: true },
  { id: 'residents', label: 'Residents', checked: true },
  { id: 'location', label: 'Location', checked: true },
  { id: 'city', label: 'City', checked: false },
  { id: 'county', label: 'County', checked: false },
  { id: 'taxId', label: 'Tax ID', checked: false },
  { id: 'foundedDate', label: 'Onboarding Date', checked: true },
  { id: 'annualFees', label: 'Annual Fees', checked: true },
  { id: 'manager', label: 'Manager', checked: true },
  { id: 'hasPool', label: 'Has Pool', checked: false },
  { id: 'hasGate', label: 'Has Gate', checked: false },
  { id: 'hasPedestrianGate', label: 'Has Pedestrian Gate', checked: false },
  { id: 'status', label: 'Status', checked: true },
  { id: 'offsiteAddresses', label: 'Offsite Addresses', checked: false },
  { id: 'leases', label: 'Leases', checked: false },
  { id: 'serviceType', label: 'Service Type', checked: false },
  { id: 'assessmentFrequency', label: 'Assessment Frequency', checked: false }
];

