
import { Association as TypeAssociation } from '@/types/association';
import { Association as HookAssociation } from '@/hooks/use-associations';

/**
 * Convert Association from type definition to hook type
 */
export const adaptFullTypeToAssociation = (assoc: TypeAssociation): HookAssociation => {
  return {
    id: assoc.id,
    name: assoc.name,
    type: assoc.type,
    status: assoc.status,
    units: assoc.units,
    // Convert object address to string if needed by HookAssociation
    address: typeof assoc.address === 'object' 
      ? `${assoc.address.street}, ${assoc.address.city}, ${assoc.address.state} ${assoc.address.zipCode}`
      : assoc.address,
    // Handle other properties safely
    managementCompanyId: assoc.managementCompanyId || null,
    settings: assoc.settings || {},
  };
};

/**
 * Convert Association from hook type to full type definition
 */
export const adaptAssociationsToFullType = (assocs: HookAssociation[]): TypeAssociation[] => {
  return assocs.map(assoc => ({
    id: assoc.id,
    name: assoc.name,
    type: assoc.type,
    status: assoc.status,
    units: assoc.units,
    // Convert string address to object if needed by TypeAssociation
    address: typeof assoc.address === 'string'
      ? parseAddressString(assoc.address)
      : {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'USA'
        },
    contactInfo: {
      email: '',
      phone: '',
      website: ''
    },
    foundedDate: '',
    managementCompanyId: assoc.managementCompanyId,
    settings: assoc.settings || {},
    description: '',
  }));
};

/**
 * Helper to parse an address string into components
 */
const parseAddressString = (addressStr: string) => {
  // Simple parsing logic - in real app would be more robust
  const parts = addressStr.split(',').map(p => p.trim());
  return {
    street: parts[0] || '',
    city: parts[1] || '',
    state: (parts[2] || '').split(' ')[0] || '',
    zipCode: (parts[2] || '').split(' ')[1] || '',
    country: 'USA'
  };
};

/**
 * Convert a single Association from hook type to full type definition
 */
export const adaptAssociationToFullType = (assoc: HookAssociation | null): TypeAssociation | null => {
  if (!assoc) return null;
  
  return {
    id: assoc.id,
    name: assoc.name,
    type: assoc.type,
    status: assoc.status,
    units: assoc.units,
    address: typeof assoc.address === 'string'
      ? parseAddressString(assoc.address)
      : {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'USA'
        },
    contactInfo: {
      email: '',
      phone: '',
      website: ''
    },
    foundedDate: '',
    managementCompanyId: assoc.managementCompanyId,
    settings: assoc.settings || {},
    description: '',
  };
};
