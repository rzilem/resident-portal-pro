
import { exportToExcel } from '../exportToExcel';

/**
 * Generate and download a template for work orders
 */
export const generateWorkOrderTemplate = () => {
  const templateData = [{
    work_order_title: '',
    description: '',
    priority: '', // 'low', 'medium', 'high', 'emergency'
    category: '',
    location: '',
    reported_by: '',
    assigned_to: '',
    due_date: ''
  }];
  
  exportToExcel(templateData, 'Work_Order_Template');
};

/**
 * Generate and download a template for violation types
 */
export const generateViolationTemplate = () => {
  const templateData = [{
    violation_name: '',
    category: '',
    description: '',
    severity: '', // 'low', 'medium', 'high'
    default_fine: '',
    default_due_days: ''
  }];
  
  exportToExcel(templateData, 'Violation_Types_Template');
};
