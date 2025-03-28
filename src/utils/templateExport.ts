
/**
 * Utility functions for exporting different types of templates
 */
import { exportToExcel } from './exportToExcel';

/**
 * Generate and download a template for resident data import
 */
export const generateResidentTemplate = () => {
  const templateData = [{
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    unit_number: '',
    address: '',
    resident_type: '', // 'owner', 'tenant', 'family'
    move_in_date: '',
    is_primary: '' // 'Yes' or 'No'
  }];
  
  exportToExcel(templateData, 'Resident_Data_Template');
};

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
 * Generate and download a template for violation types
 */
export const generateViolationTemplate = () => {
  const templateData = [{
    violation_name: '',
    category: '',
    description: '',
    severity: '', // 'low', 'medium', 'high'
    default_fine: '',
    default_due_days: ''
  }];
  
  exportToExcel(templateData, 'Violation_Types_Template');
};

/**
 * Generate and download a template for financial accounts
 */
export const generateFinancialTemplate = () => {
  const templateData = [{
    account_number: '',
    account_name: '',
    account_type: '', // 'asset', 'liability', 'income', 'expense'
    account_category: '',
    is_reserve: '', // 'Yes' or 'No'
    starting_balance: ''
  }];
  
  exportToExcel(templateData, 'Financial_Accounts_Template');
};

/**
 * Generate and download a template for vendor information
 */
export const generateVendorTemplate = () => {
  const templateData = [{
    vendor_name: '',
    contact_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    services: '',
    tax_id: ''
  }];
  
  exportToExcel(templateData, 'Vendor_Information_Template');
};

/**
 * Generate and download a template for document categories
 */
export const generateDocumentCategoriesTemplate = () => {
  const templateData = [{
    category_name: '',
    parent_category: '',
    description: '',
    is_restricted: '', // 'Yes' or 'No'
    required_permission: '',
    sort_order: ''
  }];
  
  exportToExcel(templateData, 'Document_Categories_Template');
};
