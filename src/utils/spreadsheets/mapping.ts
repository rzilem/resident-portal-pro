// src/utils/spreadsheets/mapping.ts
import { ColumnMapping, ValidationResult } from './types';

export { ColumnMapping, ValidationResult } from './types';

/**
 * Generate automatic mappings based on spreadsheet headers
 */
export const generateAutoMappings = (headers: string[]): ColumnMapping[] => {
  return headers.map(header => {
    const lowerHeader = header.toLowerCase();
    let targetField = 'ignore';
    
    // Association fields
    if (lowerHeader.includes('association_name') || lowerHeader === 'name') {
      targetField = 'association_name';
    } else if (lowerHeader.includes('address')) {
      targetField = 'address';
    } else if (lowerHeader === 'city') {
      targetField = 'city';
    }
    
    // Property fields
    else if (lowerHeader.includes('unit_number') || lowerHeader === 'unit') {
      targetField = 'unit_number';
    } else if (lowerHeader.includes('property_address') || lowerHeader === 'property') {
      targetField = 'property_address';
    } else if (lowerHeader.includes('bedrooms')) {
      targetField = 'bedrooms';
    } else if (lowerHeader.includes('bathrooms')) {
      targetField = 'bathrooms';
    } else if (lowerHeader.includes('square_feet') || lowerHeader.includes('sqft')) {
      targetField = 'square_feet';
    } else if (lowerHeader.includes('property_type')) {
      targetField = 'property_type';
    }
    
    // Resident fields
    else if (lowerHeader.includes('first_name') || lowerHeader.includes('homeowner_first_name')) {
      targetField = 'first_name';
    } else if (lowerHeader.includes('last_name') || lowerHeader.includes('homeowner_last_name')) {
      targetField = 'last_name';
    } else if (lowerHeader.includes('homeowner_email')) {
      targetField = 'email';
    } else if (lowerHeader.includes('resident_type')) {
      targetField = 'resident_type';
    } else if (lowerHeader.includes('move_in_date')) {
      targetField = 'move_in_date';
    } else if (lowerHeader.includes('move_out_date')) {
      targetField = 'move_out_date';
    } else if (lowerHeader.includes('status')) {
      targetField = 'status';
    } else if (lowerHeader.includes('balance')) {
      targetField = 'balance';
    } else if (lowerHeader.includes('mailing_address')) {
      targetField = 'mailing_address';
    } else if (lowerHeader.includes('payment_preference')) {
      targetField = 'payment_preference';
    }
    
    return {
      sourceField: header,
      targetField: targetField
    };
  });
};

/**
 * Get available target fields based on import type
 */
export const getTargetFields = (importType: string): string[] => {
  switch (importType) {
    case 'association':
      return [
        'association_name',
        'address',
        'city',
        'state',
        'zip',
        'contact_phone',
        'contact_email',
        'contact_website',
        'founded_date',
        'units',
        'type',
        'status'
      ];
    case 'property':
      return [
        'association_name',
        'property_address',
        'unit_number',
        'city',
        'state',
        'zip',
        'property_type',
        'bedrooms',
        'bathrooms',
        'square_feet'
      ];
    case 'resident':
      return [
        'first_name',
        'last_name',
        'email',
        'phone',
        'property_address',
        'unit_number',
        'resident_type',
        'move_in_date',
        'move_out_date',
        'status',
        'balance',
        'mailing_address',
        'payment_preference'
      ];
    default:
      return [];
  }
};

/**
 * Get field descriptions for help text
 */
export const getFieldDescription = (field: string): string => {
  const descriptions: Record<string, string> = {
    // Association fields
    association_name: 'Name of the association',
    address: 'Street address',
    city: 'City',
    state: 'State abbreviation (e.g., CA, TX)',
    zip: 'ZIP/Postal code',
    contact_phone: 'Primary phone number',
    contact_email: 'Primary email address',
    contact_website: 'Website URL',
    founded_date: 'Date the association was founded (YYYY-MM-DD)',
    units: 'Total number of units',
    type: 'Association type (e.g., HOA, Condo)',
    status: 'Current status (e.g., active, inactive)',
    
    // Property fields
    property_address: 'Street address of the property',
    unit_number: 'Unit or apartment number',
    property_type: 'Type of property (e.g., condo, townhouse)',
    bedrooms: 'Number of bedrooms',
    bathrooms: 'Number of bathrooms',
    square_feet: 'Property square footage',
    
    // Resident fields
    first_name: 'Resident first name',
    last_name: 'Resident last name',
    email: 'Email address',
    phone: 'Phone number',
    resident_type: 'Type of resident (owner, tenant, etc.)',
    move_in_date: 'Move-in date (YYYY-MM-DD)',
    move_out_date: 'Move-out date, if applicable (YYYY-MM-DD)',
    balance: 'Current balance',
    mailing_address: 'Mailing address if different from property address',
    payment_preference: 'Preferred payment method'
  };
  
  return descriptions[field] || 'No description available';
};

/**
 * Validate column mappings
 */
export const validateMappings = (mappings: ColumnMapping[], importType: string): ValidationResult => {
  const errors: string[] = [];
  const requiredFields: Record<string, string[]> = {
    association: ['association_name', 'city', 'state'],
    property: ['property_address', 'association_name'],
    resident: ['first_name', 'last_name', 'email']
  };
  
  const requiredForType = requiredFields[importType] || [];
  const mappedFields = mappings.map(m => m.targetField);
  
  // Check if all required fields are mapped
  requiredForType.forEach(field => {
    if (!mappedFields.includes(field)) {
      errors.push(`Required field "${field}" is not mapped.`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    message: errors.length > 0 ? `${errors.length} errors found` : "Validation successful"
  };
};
