
import { isAuthenticated } from './authUtils';
import { ensureDocumentsBucketExists, testBucketAccess } from './bucketUtils';
import { toast } from 'sonner';

/**
 * Initialize document storage bucket
 * @returns Promise<boolean> True if initialization was successful
 */
export const initializeDocumentStorage = async (): Promise<boolean> => {
  console.log('Initializing document storage...');
  
  // Check if user is authenticated
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    console.log('User is not authenticated, skipping storage initialization');
    return false;
  }
  
  // Create/ensure bucket exists
  const bucketExists = await ensureDocumentsBucketExists();
  if (!bucketExists) {
    console.error('Failed to initialize document bucket');
    return false;
  }
  
  // Test bucket access
  const canAccess = await testBucketAccess();
  if (!canAccess) {
    console.error('Document bucket exists but is not accessible');
    return false;
  }
  
  console.log('Document storage initialized successfully');
  return true;
};

/**
 * Handle document storage errors
 * @param error Any error
 * @returns String with user-friendly error message
 */
export const handleDocumentStorageError = (error: unknown): string => {
  console.error('Document storage error:', error);
  
  if (error instanceof Error) {
    // Permission errors
    if (error.message.includes('permission') || error.message.includes('access')) {
      return 'You do not have permission to access document storage. Please check your account.';
    }
    
    // Authentication errors
    if (error.message.includes('auth') || error.message.includes('unauthenticated') || error.message.includes('not logged in')) {
      return 'Authentication required. Please sign in to access document storage.';
    }
    
    // Storage limit errors
    if (error.message.includes('limit') || error.message.includes('quota')) {
      return 'Storage limit exceeded. Please contact your administrator.';
    }
    
    // Return the actual error message if it's reasonably user-friendly
    if (error.message.length < 100) {
      return error.message;
    }
  }
  
  // Generic error message as fallback
  return 'An error occurred with document storage. Please try again later.';
};

