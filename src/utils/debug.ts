
/**
 * Utility functions for debugging
 */

// Log levels
export const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4
};

// Current log level (can be changed at runtime)
let currentLogLevel = LOG_LEVELS.INFO;

/**
 * Set the current log level
 * @param level The log level to set
 */
export const setLogLevel = (level: number) => {
  currentLogLevel = level;
};

/**
 * Debug log - only shows when log level is DEBUG or lower
 */
export const debugLog = (...args: any[]) => {
  if (currentLogLevel <= LOG_LEVELS.DEBUG) {
    console.log('[DEBUG]', ...args);
  }
};

/**
 * Info log - only shows when log level is INFO or lower
 */
export const infoLog = (...args: any[]) => {
  if (currentLogLevel <= LOG_LEVELS.INFO) {
    console.log('[INFO]', ...args);
  }
};

/**
 * Warning log - only shows when log level is WARN or lower
 */
export const warnLog = (...args: any[]) => {
  if (currentLogLevel <= LOG_LEVELS.WARN) {
    console.warn('[WARN]', ...args);
  }
};

/**
 * Error log - only shows when log level is ERROR or lower
 */
export const errorLog = (...args: any[]) => {
  if (currentLogLevel <= LOG_LEVELS.ERROR) {
    console.error('[ERROR]', ...args);
  }
};
