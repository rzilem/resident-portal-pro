
import { toast } from "sonner";

/**
 * Validate file size
 * @param file File to validate
 * @param maxSizeMB Maximum file size in MB
 * @returns True if valid, false otherwise
 */
export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  if (file.size > maxSizeMB * 1024 * 1024) {
    toast.error(`File is too large. Maximum size is ${maxSizeMB}MB.`);
    return false;
  }
  return true;
};

/**
 * Validate file type
 * @param file File to validate
 * @param allowedTypes Array of allowed MIME type prefixes (e.g. ['image/', 'application/pdf'])
 * @returns True if valid, false otherwise
 */
export const validateFileType = (file: File, allowedTypes: string[] = ['image/']): boolean => {
  if (!allowedTypes.some(type => file.type.startsWith(type))) {
    toast.error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
    return false;
  }
  return true;
};
