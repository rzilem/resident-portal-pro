
/**
 * Format file size to human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Determine if a file is an image based on extension or MIME type
 */
export const isImageFile = (fileNameOrType: string): boolean => {
  const lower = fileNameOrType.toLowerCase();
  return (
    lower.endsWith('.jpg') ||
    lower.endsWith('.jpeg') ||
    lower.endsWith('.png') ||
    lower.endsWith('.gif') ||
    lower.endsWith('.svg') ||
    lower.endsWith('.webp') ||
    lower.includes('image/')
  );
};

/**
 * Determine if a file is a PDF based on extension or MIME type
 */
export const isPdfFile = (fileNameOrType: string): boolean => {
  const lower = fileNameOrType.toLowerCase();
  return lower.endsWith('.pdf') || lower.includes('application/pdf');
};

/**
 * Determine if a file is an Office document
 */
export const isOfficeFile = (fileNameOrType: string): boolean => {
  const lower = fileNameOrType.toLowerCase();
  return (
    lower.endsWith('.doc') ||
    lower.endsWith('.docx') ||
    lower.endsWith('.ppt') ||
    lower.endsWith('.pptx') ||
    lower.endsWith('.xls') ||
    lower.endsWith('.xlsx') ||
    lower.includes('ms-word') ||
    lower.includes('ms-excel') ||
    lower.includes('ms-powerpoint') ||
    lower.includes('office')
  );
};

/**
 * Retrieve document categories
 */
export const getDocumentCategories = async () => {
  // In a real application, this would fetch from an API or database
  return [
    { id: 'governing', name: 'Governing Documents', accessLevel: 'homeowner' },
    { id: 'financial', name: 'Financial Documents', accessLevel: 'board' },
    { id: 'meetings', name: 'Meeting Minutes', accessLevel: 'homeowner' },
    { id: 'legal', name: 'Legal Documents', accessLevel: 'management' },
    { id: 'rules', name: 'Rules & Regulations', accessLevel: 'all' },
    { id: 'contracts', name: 'Contracts', accessLevel: 'management' }
  ];
};

/**
 * Determine if a document can be previewed
 */
export const isPreviewable = (fileType: string): boolean => {
  const lower = fileType.toLowerCase();
  return (
    isImageFile(lower) ||
    isPdfFile(lower) ||
    lower.endsWith('.txt') ||
    lower.endsWith('.html') ||
    lower.endsWith('.md')
  );
};

/**
 * Sanitize document URL for safe display
 */
export const sanitizeDocumentUrl = (url: string): string => {
  // Simple URL sanitization
  return url.replace(/[^a-zA-Z0-9-_:./?&=]/g, '');
};

/**
 * Check if document can use Office viewer
 */
export const canUseOfficeViewer = (filename: string): boolean => {
  const ext = getFileExtension(filename);
  return ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(ext);
};

/**
 * Ensure documents bucket exists (placeholder implementation)
 */
export const ensureDocumentsBucketExists = async (): Promise<boolean> => {
  // In a real app, this would check and create a storage bucket
  return true;
};

/**
 * Get document by ID (placeholder implementation)
 */
export const getDocumentById = async (id: string): Promise<any> => {
  // In a real app, this would fetch a document by ID
  console.log(`Fetching document with ID: ${id}`);
  return null;
};

/**
 * Format date (using the function from documentIconUtils)
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return 'Invalid date';
  }
};

/**
 * Get file type information
 */
export const getFileTypeInfo = (filename: string) => {
  const extension = getFileExtension(filename);
  let type = 'Unknown';
  let icon = 'file';
  
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
    type = 'Image';
    icon = 'image';
  } else if (extension === 'pdf') {
    type = 'PDF Document';
    icon = 'file-text';
  } else if (['doc', 'docx'].includes(extension)) {
    type = 'Word Document';
    icon = 'file-text';
  } else if (['xls', 'xlsx', 'csv'].includes(extension)) {
    type = 'Spreadsheet';
    icon = 'file-spreadsheet';
  } else if (['ppt', 'pptx'].includes(extension)) {
    type = 'Presentation';
    icon = 'presentation';
  } else if (['txt', 'log'].includes(extension)) {
    type = 'Text File';
    icon = 'file-text';
  } else if (['html', 'css', 'js', 'ts', 'jsx', 'tsx', 'json', 'xml'].includes(extension)) {
    type = 'Code File';
    icon = 'file-code';
  }
  
  return { type, icon, extension };
};
