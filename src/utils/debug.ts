
export const debugLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV !== 'production') {
    console.debug(`[DEBUG] ${message}`, data || '');
  }
};

export const infoLog = (message: string, data?: any) => {
  console.info(`[INFO] ${message}`, data || '');
};

export const errorLog = (message: string, data?: any) => {
  console.error(`[ERROR] ${message}`, data || '');
};

export const documentPreviewLog = (message: string, data?: any) => {
  console.log(`[DOCUMENT_PREVIEW] ${message}`, data || '');
};
