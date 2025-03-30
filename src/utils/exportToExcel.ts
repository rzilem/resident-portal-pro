
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

/**
 * Export data to Excel file
 * @param data Array of objects to export
 * @param filename Filename for the downloaded file
 * @param sheetName Name for the worksheet (default: "Sheet1")
 */
export const exportToExcel = (
  data: Record<string, any>[],
  filename: string,
  sheetName: string = 'Sheet1'
): void => {
  // Create a new workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Generate Excel file and trigger download
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  
  // Save the file
  saveAs(blob, `${filename}.xlsx`);
};

/**
 * Generate and download a template for resident onboarding
 */
export const generateOnboardingTemplate = (): void => {
  // Create sample data with headers and an example row
  const template = [
    {
      'First Name': '',
      'Last Name': '',
      'Email': '',
      'Phone': '',
      'Property Address': '',
      'Unit Number': '',
      'City': '',
      'State': '',
      'Zip': '',
      'Move In Date': '',
      'Resident Type': 'Owner', // Default value
      'Is Primary': 'Yes', // Default value
    },
    {
      'First Name': 'John',
      'Last Name': 'Smith',
      'Email': 'john.smith@example.com',
      'Phone': '(555) 123-4567',
      'Property Address': '123 Main Street',
      'Unit Number': '101',
      'City': 'Austin',
      'State': 'TX',
      'Zip': '78701',
      'Move In Date': '2023-01-15',
      'Resident Type': 'Owner',
      'Is Primary': 'Yes',
    }
  ];
  
  // Export the template
  exportToExcel(template, 'resident-onboarding-template', 'Residents');
};

/**
 * Generate and download a template for association data
 */
export const generateAssociationTemplate = (): void => {
  // Create sample data with headers and an example row
  const template = [
    {
      'Association Name': '',
      'Type': 'HOA',
      'Address': '',
      'City': '',
      'State': '',
      'Zip': '',
      'Units': '',
      'Founded Date': '',
      'Contact Email': '',
      'Contact Phone': '',
      'Contact Website': '',
    },
    {
      'Association Name': 'Oakwood Community Association',
      'Type': 'HOA',
      'Address': '789 Oak Avenue',
      'City': 'Austin',
      'State': 'TX',
      'Zip': '78703',
      'Units': '150',
      'Founded Date': '2005-06-10',
      'Contact Email': 'info@oakwoodcommunity.org',
      'Contact Phone': '(512) 555-1234',
      'Contact Website': 'www.oakwoodcommunity.org',
    }
  ];
  
  // Export the template
  exportToExcel(template, 'association-template', 'Associations');
};

/**
 * Generate and download a template for property data
 */
export const generatePropertyTemplate = (): void => {
  // Create sample data with headers and an example row
  const template = [
    {
      'Address': '',
      'Unit Number': '',
      'City': '',
      'State': '',
      'Zip': '',
      'Bedrooms': '',
      'Bathrooms': '',
      'Square Feet': '',
      'Property Type': '',
      'Association Name': '',
    },
    {
      'Address': '456 Pine Lane',
      'Unit Number': '202',
      'City': 'Austin',
      'State': 'TX',
      'Zip': '78704',
      'Bedrooms': '2',
      'Bathrooms': '2',
      'Square Feet': '1200',
      'Property Type': 'Condo',
      'Association Name': 'Oakwood Community Association',
    }
  ];
  
  // Export the template
  exportToExcel(template, 'property-template', 'Properties');
};
