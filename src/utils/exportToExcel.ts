
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
 * with pre-filled example data
 */
export const generateOnboardingTemplate = () => {
  // Create a workbook with multiple sheets
  const workbook = XLSX.utils.book_new();
  
  // Association Information Sheet with sample data
  const associationSheet = XLSX.utils.json_to_sheet([{
    association_name: 'Oakwood Heights HOA',
    address: '123 Main Street',
    city: 'Seattle',
    state: 'WA',
    zip: '98101',
    phone: '(555) 123-4567',
    email: 'info@oakwoodheights.org',
    website: 'www.oakwoodheights.org',
    year_established: '2010',
    total_units: '120',
    type: 'HOA', // 'HOA', 'Condo', 'Co-op', etc.
    fiscal_year_start: '01-01',
    tax_id: '12-3456789'
  }]);
  XLSX.utils.book_append_sheet(workbook, associationSheet, 'Association Info');
  
  // Board Members Sheet with sample data
  const boardSheet = XLSX.utils.json_to_sheet([
    {
      first_name: 'John',
      last_name: 'Smith',
      position: 'President',
      email: 'john.smith@example.com',
      phone: '(555) 111-2222',
      term_start: '2023-01-01',
      term_end: '2025-01-01'
    },
    {
      first_name: 'Sarah',
      last_name: 'Johnson',
      position: 'Treasurer',
      email: 'sarah.johnson@example.com',
      phone: '(555) 222-3333',
      term_start: '2023-01-01',
      term_end: '2025-01-01'
    },
    {
      first_name: 'Michael',
      last_name: 'Williams',
      position: 'Secretary',
      email: 'michael.williams@example.com',
      phone: '(555) 333-4444',
      term_start: '2023-01-01',
      term_end: '2025-01-01'
    }
  ]);
  XLSX.utils.book_append_sheet(workbook, boardSheet, 'Board Members');
  
  // Properties/Units Sheet with sample data
  const propertiesSheet = XLSX.utils.json_to_sheet([
    {
      unit_number: '101',
      address: '123 Main Street, Unit 101',
      owner_name: 'David Wilson',
      owner_email: 'david.wilson@example.com',
      owner_phone: '(555) 444-5555',
      square_feet: '1200',
      bedrooms: '2',
      bathrooms: '2',
      purchase_date: '2019-05-15',
      move_in_date: '2019-06-01'
    },
    {
      unit_number: '102',
      address: '123 Main Street, Unit 102',
      owner_name: 'Emily Brown',
      owner_email: 'emily.brown@example.com',
      owner_phone: '(555) 555-6666',
      square_feet: '950',
      bedrooms: '1',
      bathrooms: '1',
      purchase_date: '2020-11-10',
      move_in_date: '2021-01-05'
    },
    {
      unit_number: '103',
      address: '123 Main Street, Unit 103',
      owner_name: 'Robert Miller',
      owner_email: 'robert.miller@example.com',
      owner_phone: '(555) 666-7777',
      square_feet: '1500',
      bedrooms: '3',
      bathrooms: '2.5',
      purchase_date: '2018-07-22',
      move_in_date: '2018-08-15'
    }
  ]);
  XLSX.utils.book_append_sheet(workbook, propertiesSheet, 'Properties');
  
  // Financial Accounts Sheet with sample data
  const financialSheet = XLSX.utils.json_to_sheet([
    {
      account_number: '12345678',
      account_name: 'Operating Fund',
      institution: 'First National Bank',
      account_type: 'Checking',
      purpose: 'Day-to-day operations',
      current_balance: '65000.00',
      as_of_date: '2023-12-31'
    },
    {
      account_number: '87654321',
      account_name: 'Reserve Fund',
      institution: 'First National Bank',
      account_type: 'Savings',
      purpose: 'Capital improvements',
      current_balance: '185000.00',
      as_of_date: '2023-12-31'
    },
    {
      account_number: '45678901',
      account_name: 'Special Assessment',
      institution: 'Community Credit Union',
      account_type: 'Savings',
      purpose: 'Roof replacement project',
      current_balance: '75000.00',
      as_of_date: '2023-12-31'
    }
  ]);
  XLSX.utils.book_append_sheet(workbook, financialSheet, 'Financial Accounts');
  
  // Vendors Sheet with sample data
  const vendorSheet = XLSX.utils.json_to_sheet([
    {
      vendor_name: 'Green Thumb Landscaping',
      contact_person: 'James Green',
      service_category: 'Landscaping',
      email: 'info@greenthumb.com',
      phone: '(555) 777-8888',
      address: '456 Garden Ave, Seattle, WA 98102',
      contract_start: '2023-01-01',
      contract_end: '2023-12-31',
      payment_terms: 'Net 30'
    },
    {
      vendor_name: 'Safe & Secure Security',
      contact_person: 'Maria Rodriguez',
      service_category: 'Security',
      email: 'support@safesecure.com',
      phone: '(555) 888-9999',
      address: '789 Guard St, Seattle, WA 98103',
      contract_start: '2023-03-15',
      contract_end: '2024-03-14',
      payment_terms: 'Net 15'
    },
    {
      vendor_name: 'Clear Pool Services',
      contact_person: 'Thomas Blue',
      service_category: 'Pool Maintenance',
      email: 'service@clearpool.com',
      phone: '(555) 999-0000',
      address: '321 Splash Ave, Seattle, WA 98104',
      contract_start: '2023-05-01',
      contract_end: '2024-04-30',
      payment_terms: 'Net 30'
    }
  ]);
  XLSX.utils.book_append_sheet(workbook, vendorSheet, 'Vendors');
  
  // Rules & Regulations Sheet with sample data
  const rulesSheet = XLSX.utils.json_to_sheet([
    {
      rule_category: 'Noise',
      rule_title: 'Quiet Hours',
      rule_description: 'Quiet hours are from 10 PM to 7 AM. Excessive noise is prohibited during these hours.',
      penalty_amount: '50.00',
      date_adopted: '2020-06-15'
    },
    {
      rule_category: 'Pets',
      rule_title: 'Pet Restrictions',
      rule_description: 'Maximum of 2 pets per unit. Dogs must be leashed in common areas. Pet waste must be picked up immediately.',
      penalty_amount: '75.00',
      date_adopted: '2020-06-15'
    },
    {
      rule_category: 'Parking',
      rule_title: 'Visitor Parking',
      rule_description: 'Visitor parking limited to 72 hours. Residents may not use visitor spaces. Commercial vehicles prohibited.',
      penalty_amount: '100.00',
      date_adopted: '2021-03-10'
    }
  ]);
  XLSX.utils.book_append_sheet(workbook, rulesSheet, 'Rules');
  
  // Add Amenities Sheet with sample data
  const amenitiesSheet = XLSX.utils.json_to_sheet([
    {
      amenity_name: 'Swimming Pool',
      location: 'Central Courtyard',
      hours: '8 AM - 10 PM',
      capacity: '25',
      reservation_required: 'No',
      maintenance_schedule: 'Mondays',
      special_rules: 'No glass containers, no lifeguard on duty'
    },
    {
      amenity_name: 'Fitness Center',
      location: 'Building A, Ground Floor',
      hours: '24 hours',
      capacity: '15',
      reservation_required: 'No',
      maintenance_schedule: 'First Tuesday of month',
      special_rules: 'Must be 18+ to use equipment, wipe down after use'
    },
    {
      amenity_name: 'Community Room',
      location: 'Building B, First Floor',
      hours: '9 AM - 9 PM',
      capacity: '50',
      reservation_required: 'Yes',
      maintenance_schedule: 'As needed',
      special_rules: 'Cleaning fee may apply, no alcohol without permit'
    }
  ]);
  XLSX.utils.book_append_sheet(workbook, amenitiesSheet, 'Amenities');
  
  // Add Insurance Sheet with sample data
  const insuranceSheet = XLSX.utils.json_to_sheet([
    {
      insurance_type: 'Property Insurance',
      carrier: 'Community Insurance Co.',
      policy_number: 'PI-123456',
      coverage_amount: '10000000.00',
      deductible: '25000.00',
      effective_date: '2023-01-01',
      expiration_date: '2023-12-31',
      agent_name: 'Lisa Thompson',
      agent_phone: '(555) 123-7890',
      agent_email: 'lisa.thompson@communityins.com'
    },
    {
      insurance_type: 'Liability Insurance',
      carrier: 'Community Insurance Co.',
      policy_number: 'LI-654321',
      coverage_amount: '5000000.00',
      deductible: '10000.00',
      effective_date: '2023-01-01',
      expiration_date: '2023-12-31',
      agent_name: 'Lisa Thompson',
      agent_phone: '(555) 123-7890',
      agent_email: 'lisa.thompson@communityins.com'
    },
    {
      insurance_type: 'D&O Insurance',
      carrier: 'Board Protect Inc.',
      policy_number: 'DO-789012',
      coverage_amount: '2000000.00',
      deductible: '5000.00',
      effective_date: '2023-03-15',
      expiration_date: '2024-03-14',
      agent_name: 'Mark Wilson',
      agent_phone: '(555) 456-7890',
      agent_email: 'mark.wilson@boardprotect.com'
    }
  ]);
  XLSX.utils.book_append_sheet(workbook, insuranceSheet, 'Insurance');
  
  // Write the workbook and trigger download
  XLSX.writeFile(workbook, 'Association_Onboarding_Template.xlsx');
};

