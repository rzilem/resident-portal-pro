
import { exportToExcel } from '../exportToExcel';

/**
 * Generate and download a template for financial accounts
 */
export const generateFinancialTemplate = () => {
  const templateData = [{
    account_number: '',
    account_name: '',
    account_type: '', // 'asset', 'liability', 'income', 'expense'
    account_category: '',
    is_reserve: '', // 'Yes' or 'No'
    starting_balance: ''
  }];
  
  exportToExcel(templateData, 'Financial_Accounts_Template');
};

/**
 * Generate and download a template for accounting codes/chart of accounts
 */
export const generateAccountingCodesTemplate = () => {
  const templateData = [{
    account_code: '',
    account_name: '',
    account_type: '', // 'asset', 'liability', 'equity', 'revenue', 'expense'
    parent_account: '',
    description: '',
    is_active: '' // 'Yes' or 'No'
  }];
  
  exportToExcel(templateData, 'Accounting_Codes_Template');
};
