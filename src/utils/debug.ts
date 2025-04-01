
/**
 * Debug utility functions for logging and debugging
 */

// Enable/disable debug logging per feature
const DEBUG_CONFIG = {
  documentPreview: true,
  documentUpload: true,
  general: true,            // Changed to true for general debugging
  projectImages: true,      // Added for project images
};

/**
 * Log for document preview 
 */
export const documentPreviewLog = (message: string, data?: any) => {
  if (DEBUG_CONFIG.documentPreview) {
    console.log(`[DocumentPreview] ${message}`, data ? data : '');
  }
};

/**
 * Log for document upload
 */
export const documentUploadLog = (message: string, data?: any) => {
  if (DEBUG_CONFIG.documentUpload) {
    console.log(`[DocumentUpload] ${message}`, data ? data : '');
  }
};

/**
 * Log errors
 */
export const errorLog = (message: string, error?: any) => {
  console.error(`[ERROR] ${message}`, error ? error : '');
};

/**
 * General debug log
 */
export const debugLog = (message: string, data?: any) => {
  if (DEBUG_CONFIG.general || DEBUG_CONFIG.projectImages) {
    console.log(`[DEBUG] ${message}`, data ? data : '');
  }
};

/**
 * Info log
 */
export const infoLog = (message: string, data?: any) => {
  console.log(`[INFO] ${message}`, data ? data : '');
};
