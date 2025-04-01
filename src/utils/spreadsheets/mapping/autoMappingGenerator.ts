
import { ColumnMapping } from './types';

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
