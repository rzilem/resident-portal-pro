
/**
 * Utility functions for debugging
 */

/**
 * Log debug messages to console
 * @param message Debug message
 * @param data Optional data to log
 */
export const debugLog = (message: string, data?: any): void => {
  if (process.env.NODE_ENV !== 'production') {
    if (data) {
      console.log(`DEBUG: ${message}`, data);
    } else {
      console.log(`DEBUG: ${message}`);
    }
  }
};

/**
 * Log error messages to console
 * @param message Error message
 * @param error Optional error object
 */
export const errorLog = (message: string, error?: any): void => {
  if (error) {
    console.error(`ERROR: ${message}`, error);
  } else {
    console.error(`ERROR: ${message}`);
  }
};
