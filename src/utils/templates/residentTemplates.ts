
import { exportToExcel } from '../exportToExcel';

/**
 * Generate and download a template for resident data import with 50 sample entries
 */
export const generateResidentTemplate = () => {
  // Create template header
  const templateHeader = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    property_address: '',
    unit_number: '',
    resident_type: '', // 'owner', 'tenant', 'family'
    move_in_date: '',
    move_out_date: '',
    status: '',
    balance: '',
    mailing_address: '',
    payment_preference: '',
    association_name: ''
  };
  
  // Create template data with one example row
  const templateData = [
    templateHeader,
    {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '555-123-4567',
      property_address: '123 Main Street',
      unit_number: '101',
      resident_type: 'owner',
      move_in_date: '2023-01-01',
      move_out_date: '',
      status: 'active',
      balance: '0.00',
      mailing_address: '',
      payment_preference: 'Email',
      association_name: 'Oakwood Community Association'
    }
  ];
  
  // Add 49 more blank rows
  for (let i = 1; i < 50; i++) {
    templateData.push({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      property_address: '',
      unit_number: '',
      resident_type: '',
      move_in_date: '',
      move_out_date: '',
      status: '',
      balance: '',
      mailing_address: '',
      payment_preference: '',
      association_name: ''
    });
  }
  
  exportToExcel(templateData, 'Resident_Data_Template');
};

/**
 * Generate and download a template for owner-property-association mapping
 */
export const generateOwnerPropertyAssociationTemplate = () => {
  // Create template header
  const templateHeader = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    property_address: '',
    unit_number: '',
    resident_type: '',
    association_name: '',
    association_id: '',
    property_id: '',
    is_primary: '',
    ownership_percentage: '',
    move_in_date: '',
    notes: ''
  };
  
  // Create template data with sample
  const templateData = [
    templateHeader,
    {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '555-123-4567',
      property_address: '123 Main Street',
      unit_number: '101',
      resident_type: 'owner',
      association_name: 'Oakwood Community Association',
      association_id: 'association-uuid-example',
      property_id: 'property-uuid-example',
      is_primary: 'Yes',
      ownership_percentage: '100',
      move_in_date: '2023-01-01',
      notes: 'Primary residence'
    }
  ];
  
  // Add 49 more blank rows
  for (let i = 1; i < 50; i++) {
    templateData.push({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      property_address: '',
      unit_number: '',
      resident_type: '',
      association_name: '',
      association_id: '',
      property_id: '',
      is_primary: '',
      ownership_percentage: '',
      move_in_date: '',
      notes: ''
    });
  }
  
  exportToExcel(templateData, 'Owner_Property_Association_Template');
};
