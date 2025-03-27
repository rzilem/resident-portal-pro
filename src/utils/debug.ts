
/**
 * Utility for debug logging
 */

const DEBUG_MODE = true;

/**
 * Log debug messages to console when in debug mode
 * @param message Debug message
 * @param data Optional data to log
 */
export const debugLog = (message: string, data?: any): void => {
  if (DEBUG_MODE) {
    if (data) {
      console.log(`[DEBUG] ${message}`, data);
    } else {
      console.log(`[DEBUG] ${message}`);
    }
  }
};

/**
 * Log error messages to console
 * @param message Error message
 * @param error Error object or data
 */
export const errorLog = (message: string, error?: any): void => {
  if (error) {
    console.error(`[ERROR] ${message}`, error);
  } else {
    console.error(`[ERROR] ${message}`);
  }
};
