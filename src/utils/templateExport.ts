
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

/**
 * Generate and download a template for work orders
 */
export const generateWorkOrderTemplate = () => {
  const templateData = [{
    work_order_title: '',
    description: '',
    priority: '', // 'low', 'medium', 'high', 'emergency'
    category: '',
    location: '',
    reported_by: '',
    assigned_to: '',
    due_date: ''
  }];
  
  exportToExcel(templateData, 'Work_Order_Template');
};

/**
 * Generate and download a template for board members
 */
export const generateBoardMembersTemplate = () => {
  const templateData = [{
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    position: '', // 'President', 'Treasurer', 'Secretary', etc.
    term_start: '',
    term_end: '',
    bio: ''
  }];
  
  exportToExcel(templateData, 'Board_Members_Template');
};

/**
 * Generate and download a template for amenities
 */
export const generateAmenitiesTemplate = () => {
  const templateData = [{
    amenity_name: '',
    description: '',
    capacity: '',
    hours: '',
    reservation_fee: '',
    deposit_amount: '',
    rules: '',
    status: '' // 'active', 'inactive', 'maintenance'
  }];
  
  exportToExcel(templateData, 'Amenities_Template');
};

/**
 * Generate and download a template for accounting codes/chart of accounts
 */
export const generateAccountingCodesTemplate = () => {
  const templateData = [{
    account_code: '',
    account_name: '',
    account_type: '', // 'asset', 'liability', 'equity', 'revenue', 'expense'
    parent_account: '',
    description: '',
    is_active: '' // 'Yes' or 'No'
  }];
  
  exportToExcel(templateData, 'Accounting_Codes_Template');
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

// New template for resident pet information
export const generatePetTemplate = () => {
  const templateData = [{
    unit_number: '',
    resident_name: '',
    pet_name: '',
    pet_type: '', // 'dog', 'cat', 'bird', 'other'
    breed: '',
    color: '',
    weight: '',
    license_number: '',
    vaccination_date: '',
    emergency_contact: ''
  }];
  
  exportToExcel(templateData, 'Pet_Registration_Template');
};

// New template for vehicle registration
export const generateVehicleTemplate = () => {
  const templateData = [{
    unit_number: '',
    resident_name: '',
    make: '',
    model: '',
    year: '',
    color: '',
    license_plate: '',
    state: '',
    parking_spot: '',
    permit_number: ''
  }];
  
  exportToExcel(templateData, 'Vehicle_Registration_Template');
};

// New template for committee members
export const generateCommitteesTemplate = () => {
  const templateData = [{
    committee_name: '',
    member_first_name: '',
    member_last_name: '',
    email: '',
    phone: '',
    position: '', // 'Chair', 'Secretary', 'Member', etc.
    start_date: '',
    end_date: '',
    notes: ''
  }];
  
  exportToExcel(templateData, 'Committee_Members_Template');
};
