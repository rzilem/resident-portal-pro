import { toast } from 'sonner';

/**
 * Validates file size (in MB)
 * @param file The file to validate
 * @param maxSize Maximum file size in MB
 * @returns boolean indicating if file size is valid
 */
export const validateFileSize = (file: File, maxSize: number = 10): boolean => {
  // Convert maxSize from MB to bytes
  const maxSizeBytes = maxSize * 1024 * 1024;
  
  if (file.size > maxSizeBytes) {
    toast.error(`File size exceeds the maximum limit of ${maxSize}MB`);
    return false;
  }
  
  return true;
};

/**
 * Validates file type based on allowed MIME types or extensions
 * @param file The file to validate
 * @param allowedTypes Array of allowed MIME types or extensions
 * @returns boolean indicating if file type is valid
 */
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  // If allowedTypes includes '*/*', all file types are allowed
  if (allowedTypes.includes('*/*')) {
    return true;
  }
  
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
    toast.error(`File type not allowed: ${fileType}`);
    return false;
  }
  
  return true;
};

/**
 * Validates image dimensions
 * @param file The image file to validate
 * @param minWidth Minimum width in pixels
 * @param minHeight Minimum height in pixels
 * @param maxWidth Maximum width in pixels
 * @param maxHeight Maximum height in pixels
 * @returns Promise resolving to boolean indicating if dimensions are valid
 */
export const validateImageDimensions = (
  file: File,
  minWidth: number = 0,
  minHeight: number = 0,
  maxWidth: number = Infinity,
  maxHeight: number = Infinity
): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('File is not an image');
      resolve(false);
      return;
    }
    
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      
      const width = img.width;
      const height = img.height;
      
      if (width < minWidth || height < minHeight) {
        toast.error(`Image dimensions must be at least ${minWidth}x${minHeight}px`);
        resolve(false);
        return;
      }
      
      if (width > maxWidth || height > maxHeight) {
        toast.error(`Image dimensions must not exceed ${maxWidth}x${maxHeight}px`);
        resolve(false);
        return;
      }
      
      resolve(true);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      toast.error('Failed to load image for validation');
      resolve(false);
    };
    
    img.src = objectUrl;
  });
};
