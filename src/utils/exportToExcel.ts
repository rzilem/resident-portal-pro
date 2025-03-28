
import * as XLSX from 'xlsx';

/**
 * Export data to an Excel file and trigger download
 * @param data Array of objects to export
 * @param fileName Name for the downloaded file (without extension)
 */
export const exportToExcel = (data: any[], fileName: string) => {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    // Write the workbook and trigger download
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};

/**
 * Generate and download a comprehensive onboarding template for new associations
 */
export const generateOnboardingTemplate = () => {
  // Create a workbook with multiple sheets
  const workbook = XLSX.utils.book_new();
  
  // Association Information Sheet
  const associationSheet = XLSX.utils.json_to_sheet([{
    association_name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
    website: '',
    year_established: '',
    total_units: '',
    type: '', // 'HOA', 'Condo', 'Co-op', etc.
    fiscal_year_start: '',
    tax_id: ''
  }]);
  XLSX.utils.book_append_sheet(workbook, associationSheet, 'Association Info');
  
  // Board Members Sheet
  const boardSheet = XLSX.utils.json_to_sheet([{
    first_name: '',
    last_name: '',
    position: '',
    email: '',
    phone: '',
    term_start: '',
    term_end: ''
  }]);
  XLSX.utils.book_append_sheet(workbook, boardSheet, 'Board Members');
  
  // Properties/Units Sheet
  const propertiesSheet = XLSX.utils.json_to_sheet([{
    unit_number: '',
    address: '',
    owner_name: '',
    owner_email: '',
    owner_phone: '',
    square_feet: '',
    bedrooms: '',
    bathrooms: '',
    purchase_date: '',
    move_in_date: ''
  }]);
  XLSX.utils.book_append_sheet(workbook, propertiesSheet, 'Properties');
  
  // Financial Accounts Sheet
  const financialSheet = XLSX.utils.json_to_sheet([{
    account_number: '',
    account_name: '',
    institution: '',
    account_type: '',
    purpose: '',
    current_balance: '',
    as_of_date: ''
  }]);
  XLSX.utils.book_append_sheet(workbook, financialSheet, 'Financial Accounts');
  
  // Vendors Sheet
  const vendorSheet = XLSX.utils.json_to_sheet([{
    vendor_name: '',
    contact_person: '',
    service_category: '',
    email: '',
    phone: '',
    address: '',
    contract_start: '',
    contract_end: '',
    payment_terms: ''
  }]);
  XLSX.utils.book_append_sheet(workbook, vendorSheet, 'Vendors');
  
  // Rules & Regulations Sheet
  const rulesSheet = XLSX.utils.json_to_sheet([{
    rule_category: '',
    rule_title: '',
    rule_description: '',
    penalty_amount: '',
    date_adopted: ''
  }]);
  XLSX.utils.book_append_sheet(workbook, rulesSheet, 'Rules');
  
  // Write the workbook and trigger download
  XLSX.writeFile(workbook, 'Association_Onboarding_Template.xlsx');
};

