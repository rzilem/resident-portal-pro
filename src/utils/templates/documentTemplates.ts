
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
  const templateData = [{
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
  }];
  
  exportToExcel(templateData, 'Document_Metadata_Template');
};
