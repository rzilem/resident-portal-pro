
import { exportToExcel } from '../exportToExcel';

/**
 * Generate and download a template for document categories
 */
export const generateDocumentCategoriesTemplate = () => {
  const templateData = [{
    category_name: '',
    parent_category: '',
    description: '',
    is_restricted: '', // 'Yes' or 'No'
    required_permission: '',
    sort_order: ''
  }];
  
  exportToExcel(templateData, 'Document_Categories_Template');
};

/**
 * Generate and download a template for document metadata
 */
export const generateDocumentMetadataTemplate = () => {
  const templateData = [{
    document_name: '',
    category: '',
    description: '',
    tags: '',
    association_id: '',
    property_id: '',
    is_restricted: '',
    effective_date: '',
    expiration_date: '',
    document_type: '', // 'contract', 'policy', 'legal', etc.
    status: ''
  }];
  
  exportToExcel(templateData, 'Document_Metadata_Template');
};
