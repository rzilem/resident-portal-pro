
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { importVendors } from './vendors/vendorImportUtils';

/**
 * Import data based on type and mappings
 */
export const importData = async ({
  records,
  mappings,
  fileName,
  importType
}: {
  records: Record<string, any>[];
  mappings: {
    sourceField: string;
    targetField: string;
  }[];
  fileName: string;
  importType: string;
}): Promise<{
  success: boolean;
  recordsImported: number;
  recordsWithWarnings: number;
  errorMessage?: string;
}> => {
  try {
    console.log(`Importing ${records.length} records of type: ${importType}`);
    console.log("Raw mappings:", mappings);
    
    // Map the data according to the mappings
    const mappedRecords = records.map(record => {
      const mappedRecord: Record<string, any> = {};
      
      mappings.forEach(mapping => {
        if (mapping.targetField && mapping.targetField !== 'ignore') {
          // Get the value from the source field
          const value = record[mapping.sourceField];
          
          // If we have a value, assign it to the target field
          if (value !== undefined && value !== null) {
            // Use the target field for the key in the mapped record
            mappedRecord[mapping.targetField] = value;
          }
        }
      });
      
      // For vendor imports, ensure provider/vendor name is mapped to 'name'
      if (importType === 'vendor') {
        if (!mappedRecord.name) {
          // Try to find provider name or vendor name in the original record
          const providerName = record['Provider Name'] || record['Vendor Name'] || 
                               record['provider name'] || record['vendor name'] || 
                               record['ProviderName'] || record['VendorName'] ||
                               record['Company Name'] || record['Company'] ||
                               record['company name'] || record['company'];
          if (providerName) {
            mappedRecord.name = providerName;
          }
        }
      }
      
      return mappedRecord;
    });

    console.log("Mapped records sample:", mappedRecords.slice(0, 2));
    
    let result;
    
    // Based on import type, call the appropriate import function
    switch (importType) {
      case 'vendor':
        console.log("Calling vendor import function with", mappedRecords.length, "records");
        result = await importVendors(mappedRecords);
        console.log("Vendor import result:", result);
        break;
      default:
        throw new Error(`Import type ${importType} not supported`);
    }
    
    if (!result.success) {
      console.error('Import errors:', result.errorDetails);
      let errorMessage = `Import encountered errors: ${result.errors} error(s) occurred`;
      
      // Add more detailed error information if available
      if (result.errorDetails && result.errorDetails.length > 0) {
        const firstError = result.errorDetails[0];
        if (typeof firstError === 'object' && firstError.error) {
          errorMessage += `: ${firstError.error}`;
          
          // If there's a batch number, include it
          if (firstError.batch) {
            errorMessage += ` (in batch ${firstError.batch})`;
          }
        } else if (typeof firstError === 'string') {
          errorMessage += `: ${firstError}`;
        } else if (firstError.message) {
          errorMessage += `: ${firstError.message}`;
        }
      }
      
      return {
        success: false,
        recordsImported: result.imported,
        recordsWithWarnings: 0,
        errorMessage
      };
    }
    
    // Log the import operation
    try {
      await supabase.from('file_operation_logs').insert({
        operation_type: `import_${importType}`,
        file_name: fileName,
        file_count: records.length,
        metadata: { 
          imported: result.imported,
          mappings: mappings
        }
      });
      console.log("Import operation logged successfully");
    } catch (logError) {
      console.error("Error logging import operation:", logError);
      // Continue despite logging error
    }
    
    return {
      success: true,
      recordsImported: result.imported,
      recordsWithWarnings: 0
    };
    
  } catch (error) {
    console.error('Import error:', error);
    return {
      success: false,
      recordsImported: 0,
      recordsWithWarnings: 0,
      errorMessage: error instanceof Error ? error.message : 'Unknown error during import'
    };
  }
};
