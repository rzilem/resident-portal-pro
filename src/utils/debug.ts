
// Enable or disable different types of logging
const DEBUG = {
  GENERAL: true,
  ERROR: true,
  INFO: true,
  WARNING: true,
  DOCUMENT_PREVIEW: true,
  AUTH: true,
  API: true,
  PERFORMANCE: false
};

// General purpose debug logger
export const debugLog = (message: string, data?: any) => {
  if (DEBUG.GENERAL) {
    if (data) {
      console.log(`[DEBUG] ${message}`, data);
    } else {
      console.log(`[DEBUG] ${message}`);
    }
  }
};

// Error logger
export const errorLog = (message: string, error?: any) => {
  if (DEBUG.ERROR) {
    if (error) {
      console.error(`[ERROR] ${message}`, error);
    } else {
      console.error(`[ERROR] ${message}`);
    }
  }
};

// Info logger
export const infoLog = (message: string, data?: any) => {
  if (DEBUG.INFO) {
    if (data) {
      console.info(`[INFO] ${message}`, data);
    } else {
      console.info(`[INFO] ${message}`);
    }
  }
};

// Warning logger
export const warningLog = (message: string, data?: any) => {
  if (DEBUG.WARNING) {
    if (data) {
      console.warn(`[WARNING] ${message}`, data);
    } else {
      console.warn(`[WARNING] ${message}`);
    }
  }
};

// Document preview logger
export const documentPreviewLog = (message: string, data?: any) => {
  if (DEBUG.DOCUMENT_PREVIEW) {
    if (data) {
      console.log(`[DOCUMENT PREVIEW] ${message}`, data);
    } else {
      console.log(`[DOCUMENT PREVIEW] ${message}`);
    }
  }
};

// Authentication logger
export const authLog = (message: string, data?: any) => {
  if (DEBUG.AUTH) {
    if (data) {
      console.log(`[AUTH] ${message}`, data);
    } else {
      console.log(`[AUTH] ${message}`);
    }
  }
};

// API request logger
export const apiLog = (message: string, data?: any) => {
  if (DEBUG.API) {
    if (data) {
      console.log(`[API] ${message}`, data);
    } else {
      console.log(`[API] ${message}`);
    }
  }
};

// Performance logger with timing
export const perfLog = (label: string) => {
  if (!DEBUG.PERFORMANCE) return { end: () => {} };
  
  const start = performance.now();
  console.log(`[PERF] Started: ${label}`);
  
  return {
    end: () => {
      const duration = performance.now() - start;
      console.log(`[PERF] Ended: ${label} (${duration.toFixed(2)}ms)`);
    }
  };
};
