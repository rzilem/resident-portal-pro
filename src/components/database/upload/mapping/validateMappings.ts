
import { ColumnMapping } from '@/utils/spreadsheets/autoMapping';

export interface ValidationResults {
  total: number;
  valid: number;
  warnings: number;
  errors: number;
}

export const validateMappings = (
  mappings: ColumnMapping[],
  fileData: {
    headers: string[];
    rows: Record<string, any>[];
  } | null,
  requiredFields: string[] = [
    'association_name', 
    'association_address', 
    'association_phone', 
    'association_email', 
    'property_units_count'
  ]
): { isValid: boolean; message?: string; validationResults?: ValidationResults } => {
  if (!fileData || fileData.rows.length === 0) {
    return { isValid: false, message: "No data found to validate. Please upload a file with data." };
  }
  
  // Validate the mappings
  const mapped = mappings.filter(m => m.targetField).map(m => m.targetField);
  const missingRequired = requiredFields.filter(field => !mapped.includes(field));
  
  if (missingRequired.length > 0) {
    return { 
      isValid: false, 
      message: `Please map required fields: ${missingRequired.join(', ')}` 
    };
  }
  
  // Process the data with mappings
  const totalRecords = fileData.rows.length;
  let valid = 0;
  let warnings = 0;
  let errors = 0;
  
  // Simulate validation results based on data
  fileData.rows.forEach(row => {
    let hasWarning = false;
    let hasError = false;
    
    // Check for email format
    const emailMapping = mappings.find(m => m.targetField === 'association_email');
    if (emailMapping && emailMapping.sourceField) {
      const email = row[emailMapping.sourceField];
      if (email && !String(email).includes('@')) {
        hasWarning = true;
      }
    }
    
    // Check for empty required fields
    for (const reqField of requiredFields) {
      const mapping = mappings.find(m => m.targetField === reqField);
      if (mapping && mapping.sourceField) {
        const value = row[mapping.sourceField];
        if (!value && value !== 0) {
          hasError = true;
          break;
        }
      }
    }
    
    if (hasError) errors++;
    else if (hasWarning) warnings++;
    else valid++;
  });
  
  // Set validation results
  const validationResults = {
    total: totalRecords,
    valid,
    warnings,
    errors
  };
  
  return { isValid: true, validationResults };
};
