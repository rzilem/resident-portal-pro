
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
    const lowerHeader = header.toLowerCase().replace(/[^a-z0-9_]/g, '');
    
    // Try to find a matching system field
    let targetField = '';
    
    // Association fields
    if (
      lowerHeader.includes('association') && lowerHeader.includes('name') ||
      lowerHeader === 'associationname'
    ) {
      targetField = 'association_name';
    } else if (
      lowerHeader.includes('association') && lowerHeader.includes('address') ||
      lowerHeader === 'associationaddress'
    ) {
      targetField = 'association_address';
    } else if (
      lowerHeader.includes('association') && lowerHeader.includes('phone') ||
      lowerHeader === 'associationphone'
    ) {
      targetField = 'association_phone';
    } else if (
      lowerHeader.includes('association') && lowerHeader.includes('email') ||
      lowerHeader === 'associationemail'
    ) {
      targetField = 'association_email';
    } else if (
      lowerHeader.includes('association') && lowerHeader.includes('tax') ||
      lowerHeader === 'taxid'
    ) {
      targetField = 'association_tax_id';
    } else if (
      lowerHeader.includes('association') && lowerHeader.includes('type') ||
      lowerHeader === 'associationtype' || lowerHeader === 'hoatype'
    ) {
      targetField = 'association_type';
    }
    // Property fields
    else if (
      lowerHeader.includes('property') && lowerHeader.includes('name') ||
      lowerHeader === 'propertyname'
    ) {
      targetField = 'property_name';
    } else if (
      lowerHeader.includes('property') && lowerHeader.includes('type') ||
      lowerHeader === 'propertytype'
    ) {
      targetField = 'property_type';
    } else if (
      lowerHeader.includes('year') && lowerHeader.includes('built') ||
      lowerHeader === 'yearbuilt'
    ) {
      targetField = 'property_year_built';
    } else if (
      lowerHeader.includes('unit') && lowerHeader.includes('count') ||
      lowerHeader === 'totalunits' || lowerHeader === 'units'
    ) {
      targetField = 'property_units_count';
    }
    // Unit fields
    else if (
      lowerHeader === 'unitnumber' || lowerHeader === 'unit' || lowerHeader === 'unitno'
    ) {
      targetField = 'unit_number';
    } else if (
      lowerHeader.includes('unit') && lowerHeader.includes('address') ||
      lowerHeader === 'unitaddress'
    ) {
      targetField = 'unit_address';
    } else if (
      lowerHeader.includes('bedrooms') || lowerHeader === 'beds'
    ) {
      targetField = 'unit_bedrooms';
    } else if (
      lowerHeader.includes('bathrooms') || lowerHeader === 'baths'
    ) {
      targetField = 'unit_bathrooms';
    } else if (
      lowerHeader.includes('square') || lowerHeader === 'sqft' || lowerHeader === 'sqfeet'
    ) {
      targetField = 'unit_square_feet';
    }
    // Homeowner fields
    else if (
      lowerHeader.includes('homeowner') && lowerHeader.includes('id') ||
      lowerHeader === 'homeownerid'
    ) {
      targetField = 'homeowner_id';
    } else if (
      lowerHeader.includes('first') && lowerHeader.includes('name') ||
      lowerHeader === 'firstname'
    ) {
      targetField = 'homeowner_first_name';
    } else if (
      lowerHeader.includes('last') && lowerHeader.includes('name') ||
      lowerHeader === 'lastname'
    ) {
      targetField = 'homeowner_last_name';
    } else if (
      lowerHeader.includes('email') && !lowerHeader.includes('association')
    ) {
      targetField = 'homeowner_email';
    } else if (
      lowerHeader.includes('phone') && !lowerHeader.includes('alternate') && 
      !lowerHeader.includes('association')
    ) {
      targetField = 'homeowner_phone';
    } else if (
      lowerHeader.includes('alternate') && lowerHeader.includes('phone') ||
      lowerHeader === 'alternatephone'
    ) {
      targetField = 'homeowner_alternate_phone';
    } else if (
      lowerHeader.includes('mailing') && lowerHeader.includes('address') ||
      lowerHeader === 'mailingaddress'
    ) {
      targetField = 'homeowner_mailing_address';
    } else if (
      lowerHeader.includes('move') && lowerHeader.includes('in') ||
      lowerHeader === 'movein' || lowerHeader === 'moveindate'
    ) {
      targetField = 'homeowner_move_in_date';
    } else if (
      lowerHeader === 'status' && !lowerHeader.includes('compliance')
    ) {
      targetField = 'homeowner_status';
    } else if (
      lowerHeader.includes('owner') && lowerHeader.includes('type') ||
      lowerHeader === 'ownertype'
    ) {
      targetField = 'homeowner_type';
    } else if (
      lowerHeader.includes('primary') && lowerHeader.includes('residence') ||
      lowerHeader === 'primaryresidence'
    ) {
      targetField = 'homeowner_primary_residence';
    } else if (
      lowerHeader.includes('balance') || lowerHeader === 'currentbalance'
    ) {
      targetField = 'homeowner_balance';
    } else if (
      lowerHeader.includes('payment') && lowerHeader.includes('date') ||
      lowerHeader === 'lastpaymentdate'
    ) {
      targetField = 'homeowner_last_payment_date';
    } else if (
      lowerHeader.includes('payment') && lowerHeader.includes('amount') ||
      lowerHeader === 'lastpaymentamount'
    ) {
      targetField = 'homeowner_last_payment_amount';
    } else if (
      lowerHeader.includes('payment') && lowerHeader.includes('method') ||
      lowerHeader === 'paymentmethod'
    ) {
      targetField = 'homeowner_payment_method';
    } else if (
      lowerHeader.includes('ach') && lowerHeader.includes('start') ||
      lowerHeader === 'achstartdate'
    ) {
      targetField = 'homeowner_ach_start_date';
    } else if (
      lowerHeader.includes('closing') && lowerHeader.includes('date') ||
      lowerHeader === 'closingdate'
    ) {
      targetField = 'homeowner_closing_date';
    } else if (
      lowerHeader.includes('comm') && lowerHeader.includes('preference') ||
      lowerHeader === 'commpreference' || lowerHeader === 'communicationpreference'
    ) {
      targetField = 'homeowner_comm_preference';
    } else if (
      lowerHeader.includes('billing') && lowerHeader.includes('preference') ||
      lowerHeader === 'billingpreference'
    ) {
      targetField = 'homeowner_billing_preference';
    } else if (
      lowerHeader.includes('emergency') && lowerHeader.includes('contact') ||
      lowerHeader === 'emergencycontact'
    ) {
      targetField = 'homeowner_emergency_contact';
    } else if (
      lowerHeader.includes('board') && lowerHeader.includes('member') ||
      lowerHeader === 'boardmember'
    ) {
      targetField = 'homeowner_board_member';
    } else if (
      lowerHeader === 'notes' || lowerHeader === 'comments'
    ) {
      targetField = 'homeowner_notes';
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
    // Financial
    else if (lowerHeader.includes('fiscal') && lowerHeader.includes('year')) {
      targetField = 'fiscal_year_start';
    } else if (lowerHeader.includes('fees') && lowerHeader.includes('frequency')) {
      targetField = 'fees_frequency';
    } else if (lowerHeader.includes('annual') && lowerHeader.includes('fees')) {
      targetField = 'annual_fees';
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
