
import { Property } from '@/types/property';

// Use 'export type' for re-exporting types when isolatedModules is enabled
export type { Property };

export const getDefaultProperties = (): Property[] => [
  {
    id: '1',
    name: 'Sunset Heights HOA',
    location: 'Los Angeles, CA',
    units: 48,
    status: 'Active',
    onboardingDate: '2010-01-15',
    annualFees: 2400,
    assessmentFrequency: 'Monthly',
    hasPool: true,
    hasGate: true,
    hasPedestrianGate: true,
    county: 'Los Angeles',
    city: 'Los Angeles',
    offsiteAddresses: 12,
    leases: 8,
    serviceType: 'Full',
    associationId: '1'
  },
  {
    id: '2',
    name: 'Ocean View Condos',
    location: 'Miami, FL',
    units: 120,
    status: 'Active',
    onboardingDate: '2015-06-20',
    annualFees: 3600,
    assessmentFrequency: 'Monthly',
    hasPool: true,
    hasGate: true,
    hasPedestrianGate: false,
    county: 'Miami-Dade',
    city: 'Miami',
    offsiteAddresses: 35,
    leases: 42,
    serviceType: 'Full',
    associationId: '2'
  },
  {
    id: '3',
    name: 'Mountain Valley Association',
    location: 'Denver, CO',
    units: 75,
    status: 'Inactive',
    onboardingDate: '2008-03-10',
    annualFees: 1800,
    assessmentFrequency: 'Quarterly',
    hasPool: false,
    hasGate: false,
    hasPedestrianGate: false,
    county: 'Denver',
    city: 'Denver',
    offsiteAddresses: 15,
    leases: 10,
    serviceType: 'Limited',
    associationId: '3'
  }
];

export const getDefaultColumns = () => {
  return [
    { id: 'name', label: 'Association Name', checked: true },
    { id: 'location', label: 'Location', checked: true },
    { id: 'units', label: 'Units', checked: true },
    { id: 'status', label: 'Status', checked: true },
    { id: 'onboardingDate', label: 'Onboarding Date', checked: true },
    { id: 'annualFees', label: 'Annual Fees', checked: false },
    { id: 'assessmentFrequency', label: 'Assessment Frequency', checked: true },
    { id: 'hasPool', label: 'Has Pool', checked: false },
    { id: 'hasGate', label: 'Has Gate', checked: false },
    { id: 'hasPedestrianGate', label: 'Has Pedestrian Gate', checked: false },
    { id: 'county', label: 'County', checked: false },
    { id: 'city', label: 'City', checked: false },
    { id: 'offsiteAddresses', label: 'Offsite Addresses', checked: false },
    { id: 'leases', label: 'Leases', checked: false },
    { id: 'serviceType', label: 'Service Type', checked: false }
  ];
};

export const getPropertiesFromAssociations = (associations: any[]): Property[] => {
  return associations.map(association => ({
    id: association.id,
    name: association.name,
    location: `${association.address?.city}, ${association.address?.state}`,
    units: association.units,
    status: association.status === 'active' ? 'Active' : 'Inactive',
    onboardingDate: association.foundedDate || association.onboardingDate,
    annualFees: Number(association.settings?.annualFees || 0),
    assessmentFrequency: association.settings?.feesFrequency 
      ? association.settings.feesFrequency.charAt(0).toUpperCase() + association.settings.feesFrequency.slice(1)
      : 'Not set',
    county: association.settings?.county,
    city: association.address?.city,
    offsiteAddresses: association.settings?.offsiteAddresses ? Number(association.settings.offsiteAddresses) : undefined,
    leases: association.settings?.leases ? Number(association.settings.leases) : undefined,
    serviceType: association.settings?.serviceType,
    hasPool: association.settings?.hasPool,
    hasGate: association.settings?.hasGate,
    hasPedestrianGate: association.settings?.hasPedestrianGate,
    associationId: association.id,
    address: association.address?.street
  }));
};
