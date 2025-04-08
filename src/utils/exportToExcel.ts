
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Export data to Excel file
 */
export const exportToExcel = <T extends Record<string, any>>(
  data: T[],
  fileName: string = "export.xlsx",
  sheetName: string = "Sheet1"
) => {
  // Convert data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Create workbook and append worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Generate buffer
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
  // Create blob and save file
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, fileName);
};

/**
 * Generate a template for vendor import
 */
export const generateVendorTemplate = () => {
  // Sample data structure
  const sampleData = [
    {
      "Vendor Name": "ABC Company",
      "Contact Name": "John Doe",
      "Email": "john@abccompany.com",
      "Phone": "(555) 123-4567",
      "Address": "123 Main St, Suite 100",
      "City": "Anytown",
      "State": "CA",
      "ZIP": "90210",
      "Category": "Maintenance",
      "Status": "Active",
      "Tax ID": "12-3456789",
      "Notes": "Preferred vendor for plumbing services",
      "Provider Type": "Service Provider",
      "Is Preferred": "Yes",
      "Is 1099": "Yes"
    },
    {
      "Vendor Name": "XYZ Services",
      "Contact Name": "Jane Smith",
      "Email": "jane@xyzservices.com",
      "Phone": "(555) 987-6543",
      "Address": "456 Oak Avenue",
      "City": "Springfield",
      "State": "IL",
      "ZIP": "62704",
      "Category": "Landscaping",
      "Status": "Active",
      "Tax ID": "98-7654321",
      "Notes": "Seasonal landscaping services",
      "Provider Type": "Service Provider",
      "Is Preferred": "No",
      "Is 1099": "Yes"
    }
  ];
  
  exportToExcel(sampleData, "vendor_import_template.xlsx", "Vendors");
};

/**
 * Generate a template for onboarding
 */
export const generateOnboardingTemplate = (type: string = 'association') => {
  let templateData: Record<string, any>[] = [];
  let fileName = '';
  
  switch (type) {
    case 'association': 
      templateData = [
        {
          "Association Name": "Sample HOA",
          "Address": "123 Main Street",
          "City": "Anytown",
          "State": "CA",
          "Zip": "90210",
          "Total Units": "150",
          "Association Type": "HOA",
          "Contact Email": "info@samplehoa.com",
          "Contact Phone": "(555) 123-4567",
          "Founded Date": "2010-01-01"
        }
      ];
      fileName = "association_template.xlsx";
      break;
      
    case 'property':
      templateData = [
        {
          "Property Address": "123 Main Street",
          "Unit Number": "101",
          "City": "Anytown",
          "State": "CA",
          "ZIP": "90210",
          "Bedrooms": "2",
          "Bathrooms": "2",
          "Square Feet": "1200",
          "Property Type": "Condo",
          "Association Name": "Sample HOA"
        }
      ];
      fileName = "property_template.xlsx";
      break;
      
    case 'resident':
      templateData = [
        {
          "First Name": "John",
          "Last Name": "Doe",
          "Email": "john.doe@example.com",
          "Phone": "(555) 123-4567",
          "Property Address": "123 Main Street",
          "Unit Number": "101",
          "Resident Type": "Owner",
          "Move In Date": "2020-01-01"
        }
      ];
      fileName = "resident_template.xlsx";
      break;
  }
  
  exportToExcel(templateData, fileName, type.charAt(0).toUpperCase() + type.slice(1));
};
