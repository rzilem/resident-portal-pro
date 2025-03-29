
import { toast } from "sonner";
import { debugLog, errorLog } from "@/utils/debug";
import { uploadFile } from "./storage/uploadFile";
import { getFileUrl } from "./storage/getUrl";
import { validateFileSize, validateFileType } from "./storage/validators";
import { supabase } from "@/integrations/supabase/client";

const COMPANY_ASSETS_BUCKET = 'company_assets';
const LOGOS_PATH = 'logos';

/**
 * Upload a company logo to the company_assets bucket
 * @param file The file to upload
 * @returns URL of the uploaded logo or null if upload failed
 */
export const uploadCompanyLogo = async (
  file: File
): Promise<string | null> => {
  try {
    // Validate file
    if (!validateFileType(file, ['image/'])) {
      return null;
    }
    
    if (!validateFileSize(file, 2)) { // 2MB limit
      return null;
    }
    
    // Upload file
    const logoUrl = await uploadFile(file, COMPANY_ASSETS_BUCKET, LOGOS_PATH);
    
    if (logoUrl) {
      toast.success('Logo uploaded successfully');
    }
    
    return logoUrl;
  } catch (error) {
    errorLog('Exception in uploadCompanyLogo:', error);
    toast.error('An unexpected error occurred while uploading the logo');
    return null;
  }
};

/**
 * Get the public URL for a company logo
 * @param path Path to the logo within the bucket
 * @returns Public URL of the logo
 */
export const getCompanyLogoUrl = (path: string): string => {
  if (path.startsWith('http')) {
    return path;
  }
  
  return getFileUrl(COMPANY_ASSETS_BUCKET, `${LOGOS_PATH}/${path}`);
};

/**
 * Delete a company logo from storage
 * @param filename The filename of the logo to delete
 * @returns True if deletion was successful, false otherwise
 */
export const deleteCompanyLogo = async (filename: string): Promise<boolean> => {
  try {
    const path = filename.includes('/') ? filename : `${LOGOS_PATH}/${filename}`;
    
    const { error } = await supabase.storage
      .from(COMPANY_ASSETS_BUCKET)
      .remove([path]);
    
    if (error) {
      errorLog('Error deleting company logo:', error);
      toast.error('Failed to delete logo');
      return false;
    }
    
    toast.success('Logo deleted successfully');
    return true;
  } catch (error) {
    errorLog('Exception in deleteCompanyLogo:', error);
    toast.error('An unexpected error occurred while deleting the logo');
    return false;
  }
};
