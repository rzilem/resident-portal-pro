
import { supabase } from '@/integrations/supabase/client';
import { debugLog, errorLog } from '@/utils/debug';

/**
 * Check if the documents bucket exists and is accessible
 * @returns Promise<boolean> True if the bucket exists and is accessible
 */
export const verifyDocumentsBucket = async (): Promise<boolean> => {
  try {
    // First check if the bucket exists
    debugLog("Checking if documents bucket exists...");
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      errorLog("Error listing buckets:", error);
      return false;
    }
    
    const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
    
    if (!documentsBucket) {
      errorLog("Documents bucket not found");
      return false;
    }
    
    debugLog("Documents bucket exists:", documentsBucket);
    
    // Now check if we can access the bucket
    const { data: files, error: listError } = await supabase.storage
      .from('documents')
      .list();
    
    if (listError) {
      errorLog("Error accessing documents bucket:", listError);
      return false;
    }
    
    debugLog("Documents bucket is accessible, files:", files);
    return true;
  } catch (error) {
    errorLog("Exception checking bucket:", error);
    return false;
  }
};
