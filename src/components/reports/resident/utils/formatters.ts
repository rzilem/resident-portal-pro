
import { formatCurrency, formatPercentage } from '../../financial/utils/formatters';

export { formatCurrency, formatPercentage };

/**
 * Format date for report display
 */
export const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

/**
 * Format status with color coding
 */
export const formatStatus = (status: string) => {
  const statusMap: Record<string, { bg: string; text: string }> = {
    'Paid': { bg: 'bg-green-100', text: 'text-green-800' },
    'Unpaid': { bg: 'bg-red-100', text: 'text-red-800' },
    'Pending': { bg: 'bg-amber-100', text: 'text-amber-800' },
    'Active': { bg: 'bg-green-100', text: 'text-green-800' },
    'Inactive': { bg: 'bg-gray-100', text: 'text-gray-800' },
    'Overdue': { bg: 'bg-red-100', text: 'text-red-800' },
    'Partial': { bg: 'bg-blue-100', text: 'text-blue-800' },
  };

  const style = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
  
  return {
    className: `px-2 py-1 rounded-full text-xs ${style.bg} ${style.text}`,
    label: status
  };
};
