
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportToExcel = (data: any[], filename: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  
  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Save file
  saveAs(blob, filename);
};

export const generateOnboardingTemplate = (type: string = 'association') => {
  let headers: string[] = [];
  let sampleData: Record<string, string>[] = [];
  
  switch (type) {
    case 'association':
      headers = ['association_name', 'address', 'city', 'state', 'zip', 'contact_phone', 'contact_email', 'contact_website', 'founded_date', 'units', 'type', 'status'];
      sampleData = [
        {
          association_name: 'Example Association',
          address: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zip: '90210',
          contact_phone: '555-123-4567',
          contact_email: 'info@example.com',
          contact_website: 'https://example.com',
          founded_date: '2020-01-01',
          units: '100',
          type: 'HOA',
          status: 'active'
        }
      ];
      break;
      
    case 'property':
      headers = ['association_name', 'property_address', 'unit_number', 'city', 'state', 'zip', 'property_type', 'bedrooms', 'bathrooms', 'square_feet'];
      sampleData = [
        {
          association_name: 'Example Association',
          property_address: '123 Main St',
          unit_number: '101',
          city: 'Anytown',
          state: 'CA',
          zip: '90210',
          property_type: 'Condo',
          bedrooms: '2',
          bathrooms: '2',
          square_feet: '1200'
        }
      ];
      break;
      
    case 'resident':
      headers = ['first_name', 'last_name', 'email', 'phone', 'property_address', 'unit_number', 'resident_type', 'move_in_date', 'move_out_date', 'status', 'balance', 'mailing_address', 'payment_preference'];
      sampleData = [
        {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          phone: '555-123-4567',
          property_address: '123 Main St',
          unit_number: '101',
          resident_type: 'owner',
          move_in_date: '2022-01-01',
          move_out_date: '',
          status: 'active',
          balance: '0.00',
          mailing_address: '',
          payment_preference: 'Email'
        }
      ];
      break;
      
    default:
      headers = ['id', 'name', 'description'];
      sampleData = [{ id: '1', name: 'Example', description: 'Sample data' }];
  }
  
  const worksheet = XLSX.utils.json_to_sheet(sampleData, { header: headers });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
  
  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Save file
  saveAs(blob, `${type}_template.xlsx`);
};

// Add the missing template generators
export const generateAssociationTemplate = () => {
  const templateData = [{
    association_name: 'Oakwood Heights HOA',
    address: '123 Main Street',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    contact_phone: '555-123-4567',
    contact_email: 'info@oakwoodheights.com',
    contact_website: 'https://oakwoodheights.com',
    founded_date: '2010-01-15',
    units: '120',
    type: 'HOA',
    status: 'active',
    annual_fees: '2400',
    assessment_frequency: 'Monthly'
  }];
  
  // Add 49 more blank rows for the template
  for (let i = 0; i < 49; i++) {
    templateData.push({
      association_name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      contact_phone: '',
      contact_email: '',
      contact_website: '',
      founded_date: '',
      units: '',
      type: '',
      status: '',
      annual_fees: '',
      assessment_frequency: ''
    });
  }
  
  exportToExcel(templateData, 'Association_Template.xlsx');
};

export const generatePropertyTemplate = () => {
  const templateData = [{
    property_name: 'Oakwood Unit 101',
    address: '123 Main Street',
    unit_number: '101',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    property_type: 'Condo',
    bedrooms: '2',
    bathrooms: '2',
    square_feet: '1200',
    association_name: 'Oakwood Heights HOA'
  }];
  
  // Add 49 more blank rows for the template
  for (let i = 0; i < 49; i++) {
    templateData.push({
      property_name: '',
      address: '',
      unit_number: '',
      city: '',
      state: '',
      zip: '',
      property_type: '',
      bedrooms: '',
      bathrooms: '',
      square_feet: '',
      association_name: ''
    });
  }
  
  exportToExcel(templateData, 'Property_Template.xlsx');
};

export const generateVendorTemplate = () => {
  const templateData = [{
    vendor_name: 'Example Vendor LLC',
    contact_name: 'Jane Smith',
    email: 'jane@examplevendor.com',
    phone: '555-987-6543',
    address: '456 Business Ave',
    city: 'Austin',
    state: 'TX',
    zip: '78702',
    services: 'Landscaping, Pool Maintenance',
    tax_id: '12-3456789',
    website: 'https://examplevendor.com',
    status: 'active'
  }];
  
  // Add 49 more blank rows for the template
  for (let i = 0; i < 49; i++) {
    templateData.push({
      vendor_name: '',
      contact_name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      services: '',
      tax_id: '',
      website: '',
      status: ''
    });
  }
  
  exportToExcel(templateData, 'Vendor_Template.xlsx');
};
