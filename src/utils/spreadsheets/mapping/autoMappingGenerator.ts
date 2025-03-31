
/**
 * Auto-mapping generator for spreadsheet columns
 */
import { ColumnMapping } from './types';
import { 
  associationFieldPatterns, 
  propertyFieldPatterns, 
  unitFieldPatterns,
  homeownerFieldPatterns,
  addressFieldPatterns,
  financialFieldPatterns
} from './fieldPatterns';

/**
 * Generate automatic mappings from spreadsheet headers to system fields
 * @param headers Array of column headers from the spreadsheet
 * @returns Array of ColumnMapping objects with best-guess mappings
 */
export const generateAutoMappings = (headers: string[]): ColumnMapping[] => {
  console.log("Generating auto mappings for headers:", headers);
  
  return headers.map(header => {
    const lowerHeader = header.toLowerCase().replace(/[^a-z0-9_]/g, '');
    let targetField = '';
    
    // Association fields
    if (associationFieldPatterns.name(header)) {
      targetField = 'association_name';
    } else if (associationFieldPatterns.address(header)) {
      targetField = 'association_address';
    } else if (associationFieldPatterns.phone(header)) {
      targetField = 'association_phone';
    } else if (associationFieldPatterns.email(header)) {
      targetField = 'association_email';
    } else if (associationFieldPatterns.taxId(header)) {
      targetField = 'association_tax_id';
    } else if (associationFieldPatterns.type(header)) {
      targetField = 'association_type';
    } else if (associationFieldPatterns.website(header)) {
      targetField = 'association_website';
    }
    // New association fields from the image
    else if (/^location$/i.test(header)) {
      targetField = 'location';
    } else if (/^units$/i.test(header)) {
      targetField = 'units';
    } else if (/^status$/i.test(header)) {
      targetField = 'status';
    } else if (/^onboarding.?date$/i.test(header)) {
      targetField = 'onboarding_date';
    } else if (/^annual.?fees$/i.test(header)) {
      targetField = 'annual_fees';
    } else if (/^assessment.?frequency$/i.test(header)) {
      targetField = 'assessment_frequency';
    } else if (/^has.?pool$/i.test(header)) {
      targetField = 'has_pool';
    } else if (/^has.?gate$/i.test(header) && !/pedestrian/i.test(header)) {
      targetField = 'has_gate';
    } else if (/^has.?pedestrian.?gate$/i.test(header)) {
      targetField = 'has_pedestrian_gate';
    } else if (/^county$/i.test(header)) {
      targetField = 'county';
    } else if (/^offsite.?addresses$/i.test(header)) {
      targetField = 'offsite_addresses';
    } else if (/^leases$/i.test(header)) {
      targetField = 'leases';
    } else if (/^service.?type$/i.test(header)) {
      targetField = 'service_type';
    }
    // Property fields
    else if (propertyFieldPatterns.name(header)) {
      targetField = 'property_name';
    } else if (propertyFieldPatterns.type(header)) {
      targetField = 'property_type';
    } else if (propertyFieldPatterns.yearBuilt(header)) {
      targetField = 'property_year_built';
    } else if (propertyFieldPatterns.unitCount(header)) {
      targetField = 'property_units_count';
    }
    // Unit fields
    else if (unitFieldPatterns.number(header)) {
      targetField = 'unit_number';
    } else if (unitFieldPatterns.address(header)) {
      targetField = 'unit_address';
    } else if (unitFieldPatterns.bedrooms(header)) {
      targetField = 'unit_bedrooms';
    } else if (unitFieldPatterns.bathrooms(header)) {
      targetField = 'unit_bathrooms';
    } else if (unitFieldPatterns.squareFeet(header)) {
      targetField = 'unit_square_feet';
    }
    // Homeowner fields
    else if (homeownerFieldPatterns.id(header)) {
      targetField = 'homeowner_id';
    } else if (homeownerFieldPatterns.firstName(header)) {
      targetField = 'homeowner_first_name';
    } else if (homeownerFieldPatterns.lastName(header)) {
      targetField = 'homeowner_last_name';
    } else if (homeownerFieldPatterns.email(header)) {
      targetField = 'homeowner_email';
    } else if (homeownerFieldPatterns.phone(header)) {
      targetField = 'homeowner_phone';
    }
    // Address components
    else if (addressFieldPatterns.street(header)) {
      targetField = 'street';
    } else if (addressFieldPatterns.city(header)) {
      targetField = 'city';
    } else if (addressFieldPatterns.state(header)) {
      targetField = 'state';
    } else if (addressFieldPatterns.zip(header)) {
      targetField = 'zip';
    } else if (addressFieldPatterns.country(header)) {
      targetField = 'country';
    }
    // Financial fields
    else if (financialFieldPatterns.fiscalYearStart(header)) {
      targetField = 'fiscal_year_start';
    } else if (financialFieldPatterns.feesFrequency(header)) {
      targetField = 'fees_frequency';
    } else if (financialFieldPatterns.annualFees(header)) {
      targetField = 'annual_fees';
    }
    
    return {
      sourceField: header,
      targetField: targetField
    };
  });
};
