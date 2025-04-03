// Validate file size (in MB)
export const validateFileSize = (file: File, maxSize: number = 10): boolean => {
  // Convert maxSize from MB to bytes
  const maxSizeBytes = maxSize * 1024 * 1024;
  
  if (file.size > maxSizeBytes) {
    console.error(`File size exceeds the maximum limit of ${maxSize}MB`);
    return false;
  }
  
  return true;
};

// Validate file type based on allowed MIME types or extensions
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  
  // Check if file type is among allowed types
  const isTypeAllowed = allowedTypes.some(type => {
    // If type ends with *, it's a wildcard (e.g., "image/*")
    if (type.endsWith('*')) {
      const typePrefix = type.slice(0, -1);
      return fileType.startsWith(typePrefix);
    }
    
    // If type starts with ".", check file extension
    if (type.startsWith('.')) {
      return fileName.endsWith(type);
    }
    
    // Otherwise, check direct match
    return fileType === type;
  });
  
  if (!isTypeAllowed) {
    console.error(`File type not allowed: ${fileType}`);
    return false;
  }
  
  return true;
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
