
import { formatCurrency, formatPercentage } from '../../financial/utils/formatters';

export { formatCurrency, formatPercentage };

/**
 * Format date for report display
 */
export const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};
