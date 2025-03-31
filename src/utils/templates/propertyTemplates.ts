/**
 * Property and unit related templates
 */
import { exportToExcel } from '../exportToExcel';

/**
 * Generate and download a template for property data import with 50 sample entries
 */
export const generatePropertyTemplate = () => {
  // Create template header
  const templateHeader = {
    property_name: '',
    address: '',
    unit_number: '',
    city: '',
    state: '',
    zip: '',
    association_id: '', // Added to link with specific association
    association_name: '', // Added for reference
    property_type: '', // 'single-family', 'condo', 'townhouse'
    bedrooms: '',
    bathrooms: '',
    square_feet: '',
    property_id: '', // Optional - provide for existing properties
    unique_identifier: '' // Optional - any unique ID to help with matching
  };
  
  // Create template data with one example row
  const templateData = [
    templateHeader,
    {
      property_name: 'Oakwood Heights Unit 101',
      address: '123 Main Street',
      unit_number: '101',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      association_id: 'association-uuid-example',
      association_name: 'Oakwood Community Association',
      property_type: 'condo',
      bedrooms: '2',
      bathrooms: '2',
      square_feet: '1200',
      property_id: '',
      unique_identifier: 'OAK-101'
    }
  ];
  
  // Add 49 more blank rows
  for (let i = 1; i < 50; i++) {
    templateData.push({
      property_name: '',
      address: '',
      unit_number: '',
      city: '',
      state: '',
      zip: '',
      association_id: '',
      association_name: '',
      property_type: '',
      bedrooms: '',
      bathrooms: '',
      square_feet: '',
      property_id: '',
      unique_identifier: ''
    });
  }
  
  exportToExcel(templateData, 'Property_Data_Template');
};

/**
 * Generate and download a template for unit/lot information
 */
export const generateUnitTemplate = () => {
  const templateData = [{
    unit_number: '',
    unit_type: '', // 'residential', 'commercial'
    floor: '',
    square_feet: '',
    bedrooms: '',
    bathrooms: '',
    parking_spaces: '',
    assessment_amount: '',
    special_features: '',
    status: '' // 'occupied', 'vacant', 'for_sale', etc.
  }];
  
  exportToExcel(templateData, 'Unit_Information_Template');
};

/**
 * Generate and download a template for association properties mapping
 * This helps ensure all properties are properly linked to their associations
 */
export const generateAssociationPropertiesTemplate = () => {
  // Create template header
  const templateHeader = {
    association_id: '',
    association_name: '',
    property_id: '',
    property_address: '',
    unit_number: '',
    property_type: '',
    status: '', // 'active', 'inactive', etc.
    date_added: '',
    date_removed: '',
    notes: ''
  };
  
  // Create template data with sample
  const templateData = [
    templateHeader,
    {
      association_id: 'association-uuid-example',
      association_name: 'Oakwood Community Association',
      property_id: 'property-uuid-example',
      property_address: '123 Main Street',
      unit_number: '101',
      property_type: 'condo',
      status: 'active',
      date_added: '2023-01-01',
      date_removed: '',
      notes: 'Original property in association'
    }
  ];
  
  // Add 49 more blank rows
  for (let i = 1; i < 50; i++) {
    templateData.push({
      association_id: '',
      association_name: '',
      property_id: '',
      property_address: '',
      unit_number: '',
      property_type: '',
      status: '',
      date_added: '',
      date_removed: '',
      notes: ''
    });
  }
  
  exportToExcel(templateData, 'Association_Properties_Template');
};
