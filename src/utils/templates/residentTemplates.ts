
/**
 * Resident and board member related templates
 */
import { exportToExcel } from '../exportToExcel';

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
