
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
    'is_1099',
    'dba',
    'check_name',
    'default_payment_method',
    'hold_payment',
    'hold_reason',
    'report_1099_box',
    'is_default',
    'is_compliant',
    'compliance_status',
    'compliance_group',
    'street_no',
    'old_provider_id'
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
    
    // Vendor name fields - map any variant to 'name'
    if (headerLower.includes('vendor name') || 
        headerLower.includes('provider name') || 
        headerLower === 'name' || 
        headerLower === 'company name' ||
        headerLower === 'company') {
      targetField = 'name';
    }
    else if (headerLower.includes('contact') || headerLower === 'contact name') {
      targetField = 'contact_name';
    }
    else if (headerLower === 'email' || headerLower === 'e-mail' || headerLower === 'email address' || headerLower === 'e mail') {
      targetField = 'email';
    }
    else if (headerLower.includes('phone')) {
      targetField = 'phone';
    }
    else if (headerLower === 'address' || headerLower === 'street address') {
      targetField = 'address';
    }
    else if (headerLower.includes('address1') || headerLower.includes('street') || headerLower === 'address line 1') {
      targetField = 'address1';
    }
    else if (headerLower.includes('address2') || headerLower.includes('suite') || headerLower === 'address line 2') {
      targetField = 'address2';
    }
    else if (headerLower === 'city') {
      targetField = 'city';
    }
    else if (headerLower === 'state' || headerLower === 'province') {
      targetField = 'state';
    }
    else if (headerLower === 'zip' || headerLower === 'postal code' || headerLower === 'zip code' || headerLower === 'zipcode') {
      targetField = 'zip';
    }
    else if (headerLower.includes('category') || headerLower.includes('type') && !headerLower.includes('provider')) {
      targetField = 'category';
    }
    else if (headerLower.includes('status')) {
      targetField = 'status';
    }
    else if (headerLower.includes('payment terms')) {
      targetField = 'payment_terms';
    }
    else if (headerLower.includes('payment method') && !headerLower.includes('default')) {
      targetField = 'payment_method';
    }
    else if (headerLower.includes('tax') || headerLower === 'ein' || headerLower === 'ssn' || headerLower.includes('tax id')) {
      targetField = 'tax_id';
    }
    else if (headerLower.includes('notes') || headerLower.includes('comments')) {
      targetField = 'notes';
    }
    else if (headerLower.includes('provider type')) {
      targetField = 'provider_type';
    }
    else if (headerLower.includes('preferred vendor') || headerLower.includes('is preferred')) {
      targetField = 'is_preferred';
    }
    else if (headerLower.includes('1099') || headerLower.includes('is 1099')) {
      targetField = 'is_1099';
    }
    else if (headerLower === 'dba' || headerLower === 'd/b/a' || headerLower.includes('doing business as')) {
      targetField = 'dba';
    }
    else if (headerLower.includes('check name')) {
      targetField = 'check_name';
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
