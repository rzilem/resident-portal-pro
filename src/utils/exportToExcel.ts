
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

/**
 * Export data to Excel file
 * @param data Array of objects to export
 * @param fileName Name of the file to be downloaded (without extension)
 */
export const exportToExcel = (data: any[], fileName: string) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    // Write to Excel file and trigger download
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    toast.error('Failed to generate Excel file');
    return false;
  }
};

/**
 * Generate and download an onboarding template based on entity type
 * @param entityType Type of entity (association, property, resident, vendor)
 */
export const generateOnboardingTemplate = (entityType: string) => {
  let templateData: any[] = [];
  let fileName = '';
  
  switch (entityType) {
    case 'association':
      templateData = [{
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
        type: '', // e.g., 'HOA', 'Condo', 'Co-op'
        status: '' // e.g., 'active', 'inactive'
      }];
      fileName = 'Association_Template';
      break;
      
    case 'property':
      templateData = [{
        association_name: '',
        property_address: '',
        unit_number: '',
        city: '',
        state: '',
        zip: '',
        property_type: '', // e.g., 'Single Family', 'Condo', 'Townhouse'
        bedrooms: '',
        bathrooms: '',
        square_feet: '',
        year_built: ''
      }];
      fileName = 'Property_Template';
      break;
      
    case 'resident':
      templateData = [{
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        property_address: '',
        unit_number: '',
        resident_type: '', // e.g., 'Owner', 'Tenant', 'Both'
        move_in_date: '',
        move_out_date: '',
        status: '',
        mailing_address: ''
      }];
      fileName = 'Resident_Template';
      break;
      
    case 'vendor':
      templateData = [{
        company_name: '',
        contact_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        service_type: '',
        website: '',
        tax_id: ''
      }];
      fileName = 'Vendor_Template';
      break;
      
    default:
      toast.error(`Unknown entity type: ${entityType}`);
      return false;
  }
  
  return exportToExcel(templateData, fileName);
};

// Add specialized template generators
export const generateAssociationTemplate = () => generateOnboardingTemplate('association');
export const generatePropertyTemplate = () => generateOnboardingTemplate('property');
export const generateResidentTemplate = () => generateOnboardingTemplate('resident');
export const generateVendorTemplate = () => generateOnboardingTemplate('vendor');
