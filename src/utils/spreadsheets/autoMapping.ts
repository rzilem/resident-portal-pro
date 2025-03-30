
/**
 * Utility functions for auto-mapping spreadsheet columns
 */

export interface ColumnMapping {
  sourceField: string;
  targetField: string;
}

/**
 * Generate automatic mappings from spreadsheet headers to system fields
 * @param headers Array of column headers from the spreadsheet
 * @returns Array of ColumnMapping objects with best-guess mappings
 */
export const generateAutoMappings = (headers: string[]): ColumnMapping[] => {
  return headers.map(header => {
    const lowerHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Try to find a matching system field
    let targetField = '';
    
    if (lowerHeader.includes('first') && lowerHeader.includes('name')) {
      targetField = 'firstName';
    } else if (lowerHeader.includes('last') && lowerHeader.includes('name')) {
      targetField = 'lastName';
    } else if (lowerHeader.includes('email')) {
      targetField = 'email';
    } else if (lowerHeader.includes('phone')) {
      targetField = 'phone';
    } else if (lowerHeader.includes('address')) {
      targetField = 'property.address';
    } else if (lowerHeader.includes('unit')) {
      targetField = 'property.unitNumber';
    } else if (lowerHeader.includes('city')) {
      targetField = 'property.city';
    } else if (lowerHeader.includes('state')) {
      targetField = 'property.state';
    } else if (lowerHeader.includes('zip') || lowerHeader.includes('postal')) {
      targetField = 'property.zip';
    }
    
    return {
      sourceField: header,
      targetField: targetField
    };
  });
};

/**
 * Validate that all required fields are mapped
 * @param mappings Array of current column mappings
 * @param requiredFields Array of required target field names
 * @returns Array of missing field names, empty if all required fields are mapped
 */
export const findMissingRequiredFields = (
  mappings: ColumnMapping[], 
  requiredFields: string[]
): string[] => {
  const mapped = mappings.map(m => m.targetField);
  return requiredFields.filter(field => !mapped.includes(field));
};

/**
 * Find the best match for a source field from available field options
 * @param sourceField The source field name from the spreadsheet
 * @param availableTargets Array of available target field names
 * @returns Best matching target field or empty string if no good match
 */
export const findBestFieldMatch = (
  sourceField: string, 
  availableTargets: {name: string, label: string}[]
): string => {
  const normalizedSource = sourceField.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Look for exact matches first
  for (const target of availableTargets) {
    const normalizedTarget = target.label.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normalizedSource === normalizedTarget) {
      return target.name;
    }
  }
  
  // Look for partial matches
  for (const target of availableTargets) {
    const normalizedTarget = target.label.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normalizedSource.includes(normalizedTarget) || normalizedTarget.includes(normalizedSource)) {
      return target.name;
    }
  }
  
  return '';
};
