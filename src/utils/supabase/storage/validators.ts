
import { toast } from "sonner";

/**
 * Validates file type against allowed types
 * @param file The file to validate
 * @param allowedTypes Array of mime type prefixes (e.g. ['image/', 'application/pdf'])
 * @returns Boolean indicating if the file type is valid
 */
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  const isValid = allowedTypes.some(type => file.type.startsWith(type));
  
  if (!isValid) {
    toast.error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
  }
  
  return isValid;
};

/**
 * Validates file size against maximum size in MB
 * @param file The file to validate
 * @param maxSizeMB Maximum file size in megabytes
 * @returns Boolean indicating if the file size is valid
 */
export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const isValid = file.size <= maxSizeBytes;
  
  if (!isValid) {
    toast.error(`File size exceeds the maximum limit of ${maxSizeMB}MB`);
  }
  
  return isValid;
};
