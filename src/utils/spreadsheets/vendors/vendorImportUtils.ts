
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Vendor } from '@/types/vendor';

/**
 * Map spreadsheet column names to database field names
 */
export const vendorFieldMappings: Record<string, string> = {
  'Provider Name': 'name',
  'Vendor Name': 'name',
  'DBA': 'dba',
  'Check Name': 'check_name',
  'Contact': 'contact_name',
  'Contact Name': 'contact_name',
  'Phone': 'phone',
  'Email': 'email',
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
  'Address': 'address',
  'Address1': 'address1',
  'Address2': 'address2',
  'City': 'city',
  'State': 'state',
  'Zip': 'zip',
  'ZIP': 'zip',
  'TaxID': 'tax_id',
  'Tax ID': 'tax_id',
  'Service Provider ID': 'old_provider_id',
  'Notes': 'notes',
  'Category': 'category',
  'Status': 'status',
  'Rating': 'rating',
};

/**
 * Process a row of vendor data from an Excel/CSV file
 */
export const processVendorRow = (row: Record<string, any>): Partial<Vendor> => {
  const vendorData: Record<string, any> = {};

  // Map spreadsheet fields to database fields based on mappings
  Object.entries(row).forEach(([key, value]) => {
    // Only include non-empty values
    if (value !== undefined && value !== null && value !== '') {
      const mappedField = vendorFieldMappings[key];
      if (mappedField) {
        vendorData[mappedField] = value;
      } else {
        // If no mapping found, use the original key
        vendorData[key] = value;
      }
    }
  });

  // Default values
  vendorData.status = vendorData.status || 'active';
  
  // Handle boolean fields - convert text values like "New Service Provider" to proper boolean
  if (vendorData.hold_payment !== undefined) {
    // If hold_payment is a string and not already a boolean
    if (typeof vendorData.hold_payment === 'string') {
      const value = vendorData.hold_payment.toLowerCase();
      if (['yes', 'y', 'true', '1'].includes(value)) {
        vendorData.hold_payment = true;
      } else if (['no', 'n', 'false', '0'].includes(value)) {
        vendorData.hold_payment = false;
      } else {
        // For any other string value (like "New Service Provider"), store the reason
        // but set the boolean flag to true
        vendorData.hold_reason = vendorData.hold_payment;
        vendorData.hold_payment = true;
      }
    }
  }
  
  console.log("Processed vendor row:", vendorData);
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
    console.log("Starting vendor import with", records.length, "records");
    
    // Process records using vendor field mappings
    const processedRecords = records.map(record => processVendorRow(record));
    console.log("Processed records sample:", processedRecords.slice(0, 2));
    
    // Filter out records without a name
    const validRecords = processedRecords.filter(record => record.name);
    
    if (validRecords.length === 0) {
      console.error("No valid vendor records found - each vendor must have a name");
      return {
        success: false,
        imported: 0,
        errors: 1,
        errorDetails: ["No valid vendor records found. Each vendor must have a name."]
      };
    }
    
    console.log("Found", validRecords.length, "valid vendor records");
    
    const errors: any[] = [];
    let imported = 0;

    // Transform boolean strings to actual booleans
    const preparedRecords = validRecords.map(record => {
      const processedRecord = {...record};
      
      // Process boolean fields
      ['is_1099', 'is_preferred', 'is_default', 'is_compliant'].forEach(field => {
        if (field in processedRecord) {
          const value = String(processedRecord[field]).toLowerCase();
          if (['yes', 'y', 'true', '1'].includes(value)) {
            processedRecord[field] = true;
          } else if (['no', 'n', 'false', '0'].includes(value)) {
            processedRecord[field] = false;
          }
        }
      });
      
      return processedRecord;
    });

    // Modify batch size for large imports
    const BATCH_SIZE = 50; // Increase batch size for better performance with large datasets

    // Insert vendors in batches
    for (let i = 0; i < preparedRecords.length; i += BATCH_SIZE) {
      const batch = preparedRecords.slice(i, i + BATCH_SIZE);
      
      console.log(`Importing batch ${Math.floor(i/BATCH_SIZE) + 1} with ${batch.length} vendors`);
      
      try {
        // Using unique constraint on name added in the migration
        const { data, error } = await supabase
          .from("vendors")
          .insert(batch);
        
        if (error) {
          console.error('Error importing vendors batch:', error);
          errors.push({
            batch: Math.floor(i/BATCH_SIZE) + 1,
            error: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          
          // If it's a unique constraint violation, try importing one by one
          if (error.code === '23505') { // Unique constraint violation
            console.log("Unique constraint violation detected, retrying records one by one");
            
            for (const record of batch) {
              try {
                const { error: singleError } = await supabase
                  .from("vendors")
                  .insert([record]);
                  
                if (!singleError) {
                  imported += 1;
                }
              } catch (individualError) {
                console.error("Error with individual record:", individualError);
                // Continue to the next record
              }
            }
          }
        } else {
          console.log(`Successfully imported batch ${Math.floor(i/BATCH_SIZE) + 1}`);
          imported += batch.length;
        }
      } catch (batchError) {
        console.error('Exception in vendor batch import:', batchError);
        errors.push({
          batch: Math.floor(i/BATCH_SIZE) + 1,
          error: batchError instanceof Error ? batchError.message : String(batchError)
        });
      }
    }

    const result = {
      success: errors.length === 0 || imported > 0,
      imported,
      errors: errors.length,
      errorDetails: errors.length > 0 ? errors : undefined
    };
    
    console.log("Import result:", result);
    
    return result;
  } catch (error) {
    console.error('Error in importVendors:', error);
    return {
      success: false,
      imported: 0,
      errors: 1,
      errorDetails: [error instanceof Error ? error.message : String(error)]
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
  console.log("Running validation with headers:", headers);
  console.log("Sample data first row:", rows.length > 0 ? rows[0] : "No rows");
  
  // Only name is required
  const requiredFields = ['name']; 
  const emailField = headers.find(h => h === 'email' || h.toLowerCase() === 'email');
  
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
      if (!row[field] || row[field].toString().trim() === '') {
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
  
  console.log("Validation results:", {
    validCount: result.validCount,
    warningCount: result.warningCount,
    errorCount: result.errorCount
  });
  
  return result;
};
