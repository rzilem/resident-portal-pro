
/**
 * Format currency for reports display
 */
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format percentage for reports display
 */
export const formatPercentage = (value: number) => {
  return `${value.toFixed(1)}%`;
};

/**
 * Format as thousands (e.g. 5000 -> 5k)
 */
export const formatThousands = (value: number) => {
  return `$${(value / 1000).toFixed(0)}k`;
};
