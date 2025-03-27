
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ensureDocumentsBucketExists } from './bucketUtils';

/**
 * Initialize document storage when the application starts
 * This should be called once during app initialization
 */
export const initializeDocumentStorage = async (): Promise<void> => {
  try {
    console.log('Initializing document storage...');
    
    // Check if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    const isAuthenticated = !!session?.user;
    
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping bucket initialization');
      return;
    }
    
    // Ensure documents bucket exists
    const success = await ensureDocumentsBucketExists();
    
    if (success) {
      console.log('Document storage initialized successfully');
    } else {
      console.error('Failed to initialize document storage');
      // Don't show error toast on initial load as it might be confusing
    }
  } catch (error) {
    console.error('Error initializing document storage:', error);
  }
};

/**
 * Handle document upload errors by showing helpful messages
 * and suggesting possible solutions
 */
export const handleDocumentStorageError = (error: Error | unknown): string => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error('Document storage error:', errorMessage);
  
  // Common error patterns
  if (errorMessage.includes('not found')) {
    return 'Storage bucket not found. Please try refreshing the page or contact support.';
  }
  
  if (errorMessage.includes('authentication') || errorMessage.includes('auth')) {
    return 'Authentication error. Please try logging in again.';
  }
  
  if (errorMessage.includes('permission') || errorMessage.includes('access')) {
    return 'Permission denied. You may not have access to this resource.';
  }
  
  if (errorMessage.includes('size') || errorMessage.includes('large')) {
    return 'File is too large. Maximum file size is 50MB.';
  }
  
  if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
    return 'Network timeout. Please check your connection and try again.';
  }
  
  // Generic fallback
  return 'An error occurred during document storage operation. Please try again later.';
};
