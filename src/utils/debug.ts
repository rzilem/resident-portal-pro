
/**
 * Log debug messages to console (only in development)
 */
export const debugLog = (...args: any[]): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[DEBUG]', ...args);
  }
};

/**
 * Log error messages to console
 */
export const errorLog = (message: string, error?: any): void => {
  console.error('[ERROR]', message);
  if (error) {
    console.error('Details:', error);
    
    // If it's an Error object with stack, log the stack trace
    if (error instanceof Error && error.stack) {
      console.error('Stack:', error.stack);
    }
  }
};

/**
 * Log warning messages to console
 */
export const warnLog = (message: string, data?: any): void => {
  console.warn('[WARNING]', message);
  if (data) {
    console.warn('Data:', data);
  }
};

/**
 * Log information messages to console
 * Use this for important flow events that should always be logged
 */
export const infoLog = (message: string, data?: any): void => {
  console.info('[INFO]', message);
  if (data) {
    console.info('Data:', data);
  }
};

/**
 * Enhanced debug logging for document preview functionality
 */
export const documentPreviewLog = (action: string, data?: any): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[DOCUMENT PREVIEW] ${action}`, data || '');
  }
};

