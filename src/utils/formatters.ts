
/**
 * Format a number as a currency string
 * @param amount - The amount to format
 * @param currencySymbol - The currency symbol to use (defaults to $)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currencySymbol: string = '$'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    currencyDisplay: 'symbol'
  })
    .format(amount)
    .replace('$', currencySymbol);
};

/**
 * Format a date string to a friendly format
 * @param dateString - The date string to format
 * @param format - The format to use (defaults to 'long')
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, format: 'short' | 'medium' | 'long' = 'long'): string => {
  const date = new Date(dateString);
  
  switch (format) {
    case 'short':
      return new Intl.DateTimeFormat('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit'
      }).format(date);
    case 'medium':
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    case 'long':
    default:
      return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
  }
};

/**
 * Format a number as a percentage
 * @param value - The value to format (e.g., 0.75 for 75%)
 * @param decimals - The number of decimal places to show
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};
