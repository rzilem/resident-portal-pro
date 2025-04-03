import { Association as HookAssociation } from '@/hooks/use-associations';
import { Association as TypeAssociation } from '@/types/association';

/**
 * Converts a simple Association from hooks/use-associations to the full Association type
 * used in the application
 */
export const adaptAssociationToFullType = (association: any): TypeAssociation => {
  // Create a base association object
  const fullAssociation: TypeAssociation = {
    id: association.id,
    name: association.name,
    
    // Ensure address is properly structured
    address: {
      street: association.address || association.street || '',
      city: association.city || '',
      state: association.state || '',
      zipCode: association.zip || association.zipCode || '',
      country: association.country || 'USA'
    },
    
    // Ensure contactInfo is properly initialized
    contactInfo: {
      email: association.contact_email || association.contactInfo?.email || '',
      phone: association.contact_phone || association.contactInfo?.phone || '',
      website: association.contact_website || association.contactInfo?.website || ''
    },
    
    type: association.type || 'hoa',
    foundedDate: association.founded_date || association.foundedDate || new Date().toISOString(),
    units: association.units || 0,
    status: association.status || 'active',
    
    // Map any settings or ensure they exist
    settings: association.settings || {}
  };
  
  return fullAssociation;
};

/**
 * Converts an array of simple Associations from hooks/use-associations to an array of
 * full Association types
 */
export const adaptAssociationsToFullType = (associations: HookAssociation[]): TypeAssociation[] => {
  return associations.map(adaptAssociationToFullType);
};

/**
 * Converts a full Association from types/association to the simple Association type
 * used in hooks/use-associations
 */
export const adaptFullTypeToAssociation = (association: TypeAssociation): HookAssociation => {
  return {
    id: association.id,
    name: association.name,
    type: association.type,
    address: association.address.street,
    city: association.address.city,
    state: association.address.state,
    zip: association.address.zipCode,
    units: association.units,
    status: association.status,
  };
};

/**
 * Converts a partial full Association to a partial simple Association
 */
export const adaptPartialFullTypeToAssociation = (
  updates: Partial<TypeAssociation>
): Partial<HookAssociation> => {
  const result: Partial<HookAssociation> = { ...updates };
  
  // Handle address conversion
  if (updates.address) {
    result.address = updates.address.street;
    result.city = updates.address.city;
    result.state = updates.address.state;
    result.zip = updates.address.zipCode;
    
    // Remove the original address object
    delete result.address;
  }
  
  // Remove other complex properties
  delete result.contactInfo;
  
  return result;
};
