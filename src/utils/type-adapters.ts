
import { Association as HookAssociation } from '@/hooks/use-associations';
import { Association as TypeAssociation } from '@/types/association';

/**
 * Converts a simple Association from hooks/use-associations to the full Association type
 * used in the application
 */
export const adaptAssociationToFullType = (association: HookAssociation): TypeAssociation => {
  return {
    id: association.id,
    name: association.name,
    address: {
      street: association.address || '',
      city: association.city || '',
      state: association.state || '',
      zipCode: association.zip || '',
      country: 'USA',
    },
    contactInfo: {
      email: '',
      phone: '',
    },
    type: (association.type as 'hoa' | 'condo' | 'coop' | 'other') || 'hoa',
    foundedDate: association.created_at || new Date().toISOString(),
    units: association.units || 0,
    status: (association.status as 'active' | 'inactive') || 'active',
  };
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
