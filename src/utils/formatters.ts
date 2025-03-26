
/**
 * Utility functions for formatting values
 */

/**
 * Gets the suffix for a day number (1st, 2nd, 3rd, etc.)
 */
export const getDaySuffix = (day: string): string => {
  const num = parseInt(day, 10);
  if (!num) return '';
  
  if (num >= 11 && num <= 13) {
    return 'th';
  }
  
  switch (num % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

/**
 * Formats a currency value
 */
export const formatCurrency = (
  value: number | string, 
  currencySymbol = '$', 
  locale = 'en-US'
): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return `${currencySymbol}0.00`;
  }
  
  return `${currencySymbol}${numValue.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Format a date in a localized way
 */
export const formatDate = (
  date: string | Date,
  options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' }
): string => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString(undefined, options);
};
