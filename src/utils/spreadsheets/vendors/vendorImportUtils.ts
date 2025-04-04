
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Vendor } from '@/types/vendor';

/**
 * Map spreadsheet column names to database field names
 */
export const vendorFieldMappings: Record<string, string> = {
  'Provider Name': 'name',
  'DBA': 'dba',
  'Check Name': 'check_name',
  'Contact': 'contact_name',
  'Phone': 'phone',
  'eMail': 'email',
  'Provider Type': 'provider_type',
  'Default Payment Method': 'default_payment_method',
  'Hold Payment': 'hold_payment',
  'Hold Reason': 'hold_reason',
  'Is 1099': 'is_1099',
  'Report 1099 Box': 'report_1099_box',
  'Is Preferred': 'is_preferred',
  'Is Default': 'is_default',
  'Is Compliant': 'is_compliant',
  'Compliance Status': 'compliance_status',
  'Compliance Group': 'compliance_group',
  'Street No': 'street_no',
  'Address1': 'address1',
  'Address2': 'address2',
  'City': 'city',
  'State': 'state',
  'Zip': 'zip',
  'TaxID': 'tax_id',
  'Service Provider ID': 'old_provider_id',
  'Notes': 'notes',
};

/**
 * Process a row of vendor data from an Excel/CSV file
 */
export const processVendorRow = (row: Record<string, any>): Partial<Vendor> => {
  const vendorData: Record<string, any> = {};

  // Map spreadsheet fields to database fields
  Object.entries(row).forEach(([key, value]) => {
    const dbField = vendorFieldMappings[key];
    if (dbField) {
      // Handle boolean conversions
      if (['is_1099', 'is_preferred', 'is_default', 'is_compliant', 'hold_payment'].includes(dbField)) {
        vendorData[dbField] = 
          value === 'Yes' || value === 'yes' || value === 'true' || value === 'TRUE' || value === true;
      } else {
        vendorData[dbField] = value;
      }
    }
  });

  // Default values
  vendorData.status = vendorData.status || 'active';
  
  return vendorData;
};

/**
 * Import vendors from processed data
 */
export const importVendors = async (records: Record<string, any>[]): Promise<{
  success: boolean;
  imported: number;
  errors: number;
  errorDetails?: any[];
}> => {
  try {
    const processedVendors: Partial<Vendor>[] = records.map(processVendorRow);
    const errors: any[] = [];
    let imported = 0;

    // Insert vendors in batches of 10
    for (let i = 0; i < processedVendors.length; i += 10) {
      const batch = processedVendors.slice(i, i + 10);
      
      // Filter out vendors with no name
      const validBatch = batch.filter(vendor => vendor.name);
      
      if (validBatch.length === 0) continue;
      
      const { data, error } = await supabase
        .from('vendors')
        .upsert(validBatch, { 
          onConflict: 'name',
          ignoreDuplicates: false
        });
      
      if (error) {
        console.error('Error importing vendors batch:', error);
        errors.push(error);
      } else {
        imported += validBatch.length;
      }
    }

    return {
      success: errors.length === 0,
      imported,
      errors: errors.length,
      errorDetails: errors.length > 0 ? errors : undefined
    };
  } catch (error) {
    console.error('Error in importVendors:', error);
    return {
      success: false,
      imported: 0,
      errors: 1,
      errorDetails: [error]
    };
  }
};

/**
 * Validate vendor data
 */
export const validateVendorData = (
  headers: string[],
  rows: Record<string, any>[]
): {
  valid: Record<string, any>[];
  invalid: Record<string, any>[];
  validCount: number;
  warningCount: number;
  errorCount: number;
} => {
  const requiredFields = ['Provider Name', 'Contact', 'Phone'];
  const emailField = headers.find(h => h === 'eMail' || h.toLowerCase() === 'email');
  
  const result = {
    valid: [] as Record<string, any>[],
    invalid: [] as Record<string, any>[],
    validCount: 0,
    warningCount: 0,
    errorCount: 0
  };
  
  for (const row of rows) {
    let isValid = true;
    let hasWarning = false;
    const errors: Record<string, string> = {};
    const warnings: Record<string, string> = {};
    
    // Check required fields
    for (const field of requiredFields) {
      const value = row[field];
      if (!value || value.toString().trim() === '') {
        isValid = false;
        errors[field] = 'Required field is missing';
      }
    }
    
    // Validate email if present
    if (emailField && row[emailField]) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(row[emailField])) {
        hasWarning = true;
        warnings[emailField] = 'Invalid email format';
      }
    }
    
    if (isValid) {
      row._warnings = hasWarning ? warnings : undefined;
      result.valid.push(row);
      if (hasWarning) result.warningCount++;
      else result.validCount++;
    } else {
      row._errors = errors;
      result.invalid.push(row);
      result.errorCount++;
    }
  }
  
  return result;
};
