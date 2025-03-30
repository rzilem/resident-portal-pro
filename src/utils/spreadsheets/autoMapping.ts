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
  console.log("Generating auto mappings for headers:", headers);
  
  return headers.map(header => {
    const lowerHeader = header.toLowerCase().replace(/[^a-z0-9_]/g, '');
    
    // Try to find a matching system field
    let targetField = '';
    
    // Association fields
    if (
      lowerHeader === 'associationname' || 
      lowerHeader === 'association_name' || 
      lowerHeader === 'name'
    ) {
      targetField = 'association_name';
    } else if (
      lowerHeader === 'associationaddress' || 
      lowerHeader === 'association_address' || 
      lowerHeader === 'address'
    ) {
      targetField = 'association_address';
    } else if (
      lowerHeader === 'associationphone' || 
      lowerHeader === 'association_phone' || 
      lowerHeader === 'phone'
    ) {
      targetField = 'association_phone';
    } else if (
      lowerHeader === 'associationemail' || 
      lowerHeader === 'association_email' || 
      lowerHeader === 'email'
    ) {
      targetField = 'association_email';
    } else if (
      lowerHeader === 'taxid' || 
      lowerHeader === 'association_tax_id' || 
      lowerHeader === 'tax_id'
    ) {
      targetField = 'association_tax_id';
    } else if (
      lowerHeader === 'associationtype' || 
      lowerHeader === 'association_type' || 
      lowerHeader === 'hoatype' ||
      lowerHeader === 'type'
    ) {
      targetField = 'association_type';
    }
    // Property fields
    else if (
      lowerHeader === 'propertyname' ||
      lowerHeader === 'property_name'
    ) {
      targetField = 'property_name';
    } else if (
      lowerHeader === 'propertytype' ||
      lowerHeader === 'property_type'
    ) {
      targetField = 'property_type';
    } else if (
      lowerHeader === 'yearbuilt' ||
      lowerHeader === 'year_built' ||
      lowerHeader === 'property_year_built' ||
      lowerHeader === 'year_established' ||
      lowerHeader === 'yearestablished' ||
      lowerHeader === 'founded'
    ) {
      targetField = 'property_year_built';
    } else if (
      lowerHeader === 'totalunits' || 
      lowerHeader === 'total_units' ||
      lowerHeader === 'units' || 
      lowerHeader === 'property_units_count' ||
      lowerHeader === 'unitcount'
    ) {
      targetField = 'property_units_count';
    }
    // Unit fields
    else if (
      lowerHeader === 'unitnumber' || 
      lowerHeader === 'unit' || 
      lowerHeader === 'unitno' ||
      lowerHeader === 'unit_number'
    ) {
      targetField = 'unit_number';
    } else if (
      lowerHeader === 'unitaddress' ||
      lowerHeader === 'unit_address'
    ) {
      targetField = 'unit_address';
    } else if (
      lowerHeader === 'bedrooms' || 
      lowerHeader === 'beds' ||
      lowerHeader === 'unit_bedrooms'
    ) {
      targetField = 'unit_bedrooms';
    } else if (
      lowerHeader === 'bathrooms' || 
      lowerHeader === 'baths' ||
      lowerHeader === 'unit_bathrooms'
    ) {
      targetField = 'unit_bathrooms';
    } else if (
      lowerHeader === 'squarefeet' || 
      lowerHeader === 'sqft' || 
      lowerHeader === 'sqfeet' ||
      lowerHeader === 'unit_square_feet' ||
      lowerHeader === 'square_feet'
    ) {
      targetField = 'unit_square_feet';
    }
    // Homeowner fields - keep the existing mappings
    else if (
      lowerHeader === 'homeownerid' ||
      lowerHeader === 'homeowner_id'
    ) {
      targetField = 'homeowner_id';
    } else if (
      lowerHeader === 'firstname' ||
      lowerHeader === 'first_name' ||
      lowerHeader === 'homeowner_first_name'
    ) {
      targetField = 'homeowner_first_name';
    } else if (
      lowerHeader === 'lastname' ||
      lowerHeader === 'last_name' ||
      lowerHeader === 'homeowner_last_name'
    ) {
      targetField = 'homeowner_last_name';
    } else if (
      lowerHeader.includes('email') && 
      !lowerHeader.includes('association') &&
      lowerHeader !== 'association_email'
    ) {
      targetField = 'homeowner_email';
    } else if (
      lowerHeader.includes('phone') && 
      !lowerHeader.includes('alternate') && 
      !lowerHeader.includes('association') &&
      lowerHeader !== 'association_phone'
    ) {
      targetField = 'homeowner_phone';
    }
    // Address components
    else if (lowerHeader === 'street' || lowerHeader === 'address1') {
      targetField = 'street';
    } else if (lowerHeader === 'city') {
      targetField = 'city';
    } else if (lowerHeader === 'state' || lowerHeader === 'province') {
      targetField = 'state';
    } else if (lowerHeader === 'zip' || lowerHeader === 'zipcode' || lowerHeader === 'postalcode') {
      targetField = 'zip';
    } else if (lowerHeader === 'country') {
      targetField = 'country';
    }
    // Financial fields
    else if (
      lowerHeader === 'fiscalyearstart' || 
      lowerHeader === 'fiscal_year_start' ||
      lowerHeader === 'fiscalyear'
    ) {
      targetField = 'fiscal_year_start';
    } else if (
      lowerHeader === 'feesfrequency' || 
      lowerHeader === 'fees_frequency'
    ) {
      targetField = 'fees_frequency';
    } else if (
      lowerHeader === 'annualfees' || 
      lowerHeader === 'annual_fees'
    ) {
      targetField = 'annual_fees';
    }
    // Website
    else if (
      lowerHeader === 'website' || 
      lowerHeader === 'association_website' ||
      lowerHeader === 'url'
    ) {
      targetField = 'association_website';
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
