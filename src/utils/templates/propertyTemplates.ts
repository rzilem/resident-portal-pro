
/**
 * Property and unit related templates
 */
import { exportToExcel } from '../exportToExcel';

/**
 * Generate and download a template for property data import
 */
export const generatePropertyTemplate = () => {
  const templateData = [{
    property_name: '',
    address: '',
    unit_number: '',
    city: '',
    state: '',
    zip: '',
    property_type: '', // 'single-family', 'condo', 'townhouse'
    bedrooms: '',
    bathrooms: '',
    square_feet: ''
  }];
  
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
