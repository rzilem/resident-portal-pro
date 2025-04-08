
import { ColumnMapping } from './types';
import { findBestFieldMatch } from './fieldMatchers';

/**
 * Get vendor field target options
 */
export const getVendorFieldOptions = (): string[] => {
  return [
    'name',
    'contact_name',
    'email',
    'phone',
    'address',
    'address1',
    'address2',
    'city',
    'state',
    'zip',
    'category',
    'status',
    'payment_terms',
    'payment_method',
    'tax_id',
    'notes',
    'provider_type',
    'is_preferred',
    'is_1099'
  ];
};

/**
 * Generate automatic mappings for vendors
 */
export const generateAutoMappings = (headers: string[]): ColumnMapping[] => {
  // Get all possible vendor fields
  const vendorFields = getVendorFieldOptions();
  
  return headers.map(header => {
    const headerLower = header.toLowerCase();
    let targetField = 'ignore';
    
    // Common vendor field mappings
    if (headerLower.includes('vendor name') || 
        headerLower.includes('provider name') || 
        headerLower === 'name' || 
        headerLower === 'company name') {
      targetField = 'name';
    }
    else if (headerLower.includes('contact') || headerLower === 'contact name') {
      targetField = 'contact_name';
    }
    else if (headerLower === 'email' || headerLower === 'e-mail' || headerLower === 'email address') {
      targetField = 'email';
    }
    else if (headerLower.includes('phone')) {
      targetField = 'phone';
    }
    else if (headerLower === 'address' || headerLower === 'street address') {
      targetField = 'address';
    }
    else if (headerLower.includes('address1') || headerLower.includes('street')) {
      targetField = 'address1';
    }
    else if (headerLower.includes('address2') || headerLower.includes('suite')) {
      targetField = 'address2';
    }
    else if (headerLower === 'city') {
      targetField = 'city';
    }
    else if (headerLower === 'state' || headerLower === 'province') {
      targetField = 'state';
    }
    else if (headerLower === 'zip' || headerLower === 'postal code' || headerLower === 'zip code') {
      targetField = 'zip';
    }
    else if (headerLower.includes('category') || headerLower.includes('type')) {
      targetField = 'category';
    }
    else if (headerLower.includes('status')) {
      targetField = 'status';
    }
    else if (headerLower.includes('payment terms')) {
      targetField = 'payment_terms';
    }
    else if (headerLower.includes('payment method')) {
      targetField = 'payment_method';
    }
    else if (headerLower.includes('tax') || headerLower === 'ein' || headerLower === 'ssn') {
      targetField = 'tax_id';
    }
    else if (headerLower.includes('notes') || headerLower.includes('comments')) {
      targetField = 'notes';
    }
    else {
      // Use field matcher for anything else
      targetField = findBestFieldMatch(header, vendorFields);
    }
    
    return {
      sourceField: header,
      targetField: targetField
    };
  });
};
