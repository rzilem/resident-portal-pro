
/**
 * Log debug messages to console (only in development)
 */
export const debugLog = (...args: any[]): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args);
  }
};

/**
 * Log error messages to console
 */
export const errorLog = (message: string, error?: any): void => {
  console.error(message);
  if (error) {
    console.error(error);
  }
};

/**
 * Log warning messages to console
 */
export const warnLog = (message: string, data?: any): void => {
  console.warn(message);
  if (data) {
    console.warn(data);
  }
};
