
/**
 * Document management related templates
 */
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
