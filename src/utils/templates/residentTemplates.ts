/**
 * Resident and board member related templates
 */
import { exportToExcel } from '../exportToExcel';

/**
 * Generate and download a template for resident data import with 50 sample entries
 */
export const generateResidentTemplate = () => {
  // Create sample header row
  const templateHeader = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    unit_number: '',
    address: '',
    property_id: '', // Added to link with specific property
    association_id: '', // Added to link with specific association
    resident_type: '', // 'owner', 'tenant', 'family'
    move_in_date: '',
    is_primary: '' // 'Yes' or 'No'
  };
  
  // Create 50 sample rows
  const templateData = [templateHeader];
  
  // Add 50 blank sample rows
  for (let i = 1; i <= 50; i++) {
    templateData.push({
      first_name: i === 1 ? 'John' : '',
      last_name: i === 1 ? 'Smith' : '',
      email: i === 1 ? 'john.smith@example.com' : '',
      phone: i === 1 ? '(555) 123-4567' : '',
      unit_number: i === 1 ? '101' : '',
      address: i === 1 ? '123 Main Street' : '',
      property_id: i === 1 ? 'property-uuid-example' : '', // Example UUID for property reference
      association_id: i === 1 ? 'association-uuid-example' : '', // Example UUID for association reference
      resident_type: i === 1 ? 'owner' : '',
      move_in_date: i === 1 ? '2023-01-15' : '',
      is_primary: i === 1 ? 'Yes' : ''
    });
  }
  
  exportToExcel(templateData, 'Resident_Data_Template');
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
 * Generate and download a template for property/owner matching
 * This helps with changing ownership while maintaining property data
 */
export const generateOwnerPropertyAssociationTemplate = () => {
  // Create template header
  const templateHeader = {
    property_id: '', // UUID of property
    property_address: '',
    unit_number: '',
    association_id: '', // UUID of association
    association_name: '',
    owner_id: '', // UUID of owner profile
    owner_first_name: '',
    owner_last_name: '',
    owner_email: '',
    owner_phone: '',
    ownership_start_date: '',
    ownership_end_date: '',
    is_current_owner: '', // Yes/No
  };
  
  // Create template data with sample
  const templateData = [
    templateHeader,
    {
      property_id: 'property-uuid-example',
      property_address: '123 Main Street',
      unit_number: '101',
      association_id: 'association-uuid-example',
      association_name: 'Oakwood Community Association',
      owner_id: 'owner-uuid-example',
      owner_first_name: 'John',
      owner_last_name: 'Smith',
      owner_email: 'john.smith@example.com',
      owner_phone: '(555) 123-4567',
      ownership_start_date: '2023-01-15',
      ownership_end_date: '',
      is_current_owner: 'Yes',
    }
  ];
  
  // Add 49 more blank rows
  for (let i = 1; i < 50; i++) {
    templateData.push({
      property_id: '',
      property_address: '',
      unit_number: '',
      association_id: '',
      association_name: '',
      owner_id: '',
      owner_first_name: '',
      owner_last_name: '',
      owner_email: '',
      owner_phone: '',
      ownership_start_date: '',
      ownership_end_date: '',
      is_current_owner: '',
    });
  }
  
  exportToExcel(templateData, 'Owner_Property_Association_Template');
};
