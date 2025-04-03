
import { toast } from 'sonner';

/**
 * Validate file type
 * @param file File to validate
 * @param allowedTypes Array of mime type prefixes (e.g. ['image/', 'application/pdf'])
 * @returns Boolean indicating if the file type is valid
 */
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  const isValid = allowedTypes.some(type => file.type.startsWith(type));
  
  if (!isValid) {
    const formattedTypes = allowedTypes.map(type => {
      if (type === 'image/') return 'images';
      if (type === 'application/pdf') return 'PDF files';
      return type;
    }).join(', ');
    
    toast.error(`Only ${formattedTypes} are allowed`);
  }
  
  return isValid;
};

/**
 * Validate file size
 * @param file File to validate
 * @param maxSizeMB Maximum file size in MB
 * @returns Boolean indicating if the file size is valid
 */
export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const isValid = file.size <= maxSizeBytes;
  
  if (!isValid) {
    toast.error(`File size should be less than ${maxSizeMB}MB`);
  }
  
  return isValid;
};
