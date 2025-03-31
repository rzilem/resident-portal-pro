
/**
 * Document management related templates
 */
import { exportToExcel } from '../exportToExcel';

/**
 * Generate and download a template for document categories
 */
export const generateDocumentCategoriesTemplate = () => {
  const templateHeader = {
    category_name: '',
    parent_category: '',
    description: '',
    is_restricted: '', // 'Yes' or 'No'
    required_permission: '',
    sort_order: ''
  };
  
  // Create template data with example
  const templateData = [
    templateHeader,
    {
      category_name: 'Board Documents',
      parent_category: '',
      description: 'Documents related to board meetings and activities',
      is_restricted: 'Yes',
      required_permission: 'board_member',
      sort_order: '1'
    },
    {
      category_name: 'Meeting Minutes',
      parent_category: 'Board Documents',
      description: 'Minutes from board and committee meetings',
      is_restricted: 'Yes',
      required_permission: 'board_member',
      sort_order: '2'
    }
  ];
  
  // Add more blank rows to reach 50 total
  for (let i = 3; i <= 50; i++) {
    templateData.push({
      category_name: '',
      parent_category: '',
      description: '',
      is_restricted: '',
      required_permission: '',
      sort_order: ''
    });
  }
  
  exportToExcel(templateData, 'Document_Categories_Template');
};

/**
 * Generate and download a template for document metadata
 */
export const generateDocumentMetadataTemplate = () => {
  const templateHeader = {
    document_name: '',
    file_path: '',
    document_type: '', // 'minutes', 'financial', 'legal', etc.
    category: '',
    tags: '',
    published_date: '',
    expiration_date: '',
    is_public: '', // 'Yes' or 'No'
    access_level: '', // 'all', 'board', 'homeowner', etc.
    association_id: '',
    property_id: '',
    description: ''
  };
  
  // Create template data with header and example
  const templateData = [
    templateHeader,
    {
      document_name: 'Annual Budget 2023',
      file_path: 'financial/budgets/2023_annual_budget.pdf',
      document_type: 'financial',
      category: 'Budgets',
      tags: 'budget,2023,annual',
      published_date: '2023-01-15',
      expiration_date: '2024-01-14',
      is_public: 'Yes',
      access_level: 'homeowner',
      association_id: '00000000-0000-0000-0000-000000000000',
      property_id: '',
      description: 'Annual budget for fiscal year 2023'
    }
  ];
  
  // Add more blank rows to reach 50 total
  for (let i = 2; i <= 50; i++) {
    templateData.push({
      document_name: '',
      file_path: '',
      document_type: '',
      category: '',
      tags: '',
      published_date: '',
      expiration_date: '',
      is_public: '',
      access_level: '',
      association_id: '',
      property_id: '',
      description: ''
    });
  }
  
  exportToExcel(templateData, 'Document_Metadata_Template');
};

/**
 * Generate and download a template for document access permissions
 */
export const generateDocumentPermissionsTemplate = () => {
  const templateHeader = {
    document_id: '',
    document_name: '',
    role: '', // 'admin', 'board', 'homeowner', etc.
    can_view: '', // 'Yes' or 'No'
    can_download: '', // 'Yes' or 'No'
    can_edit: '', // 'Yes' or 'No'
    can_delete: '', // 'Yes' or 'No'
    notes: ''
  };
  
  // Create template data with example
  const templateData = [
    templateHeader,
    {
      document_id: '00000000-0000-0000-0000-000000000000',
      document_name: 'Annual Budget 2023',
      role: 'homeowner',
      can_view: 'Yes',
      can_download: 'Yes',
      can_edit: 'No',
      can_delete: 'No',
      notes: 'Homeowners can view and download the annual budget'
    },
    {
      document_id: '00000000-0000-0000-0000-000000000000',
      document_name: 'Annual Budget 2023',
      role: 'board',
      can_view: 'Yes',
      can_download: 'Yes',
      can_edit: 'Yes',
      can_delete: 'No',
      notes: 'Board members can edit the budget'
    }
  ];
  
  // Add more blank rows to reach 50 total
  for (let i = 3; i <= 50; i++) {
    templateData.push({
      document_id: '',
      document_name: '',
      role: '',
      can_view: '',
      can_download: '',
      can_edit: '',
      can_delete: '',
      notes: ''
    });
  }
  
  exportToExcel(templateData, 'Document_Permissions_Template');
};
