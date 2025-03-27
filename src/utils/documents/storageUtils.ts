
/**
 * Main entry point for storage utilities
 * Re-exports all storage utility functions
 */

// Re-export all utility functions from the individual modules
export * from './authUtils';
export * from './bucketUtils';
export * from './policyUtils';
export * from './uploadUtils';

// Export a convenience function to initialize all storage components
export const initializeDocumentStorage = async (forceBucketCreation = false): Promise<boolean> => {
  try {
    // Import and use functions from other modules
    const { isAuthenticatedIncludingDemo, isUsingDemoCredentials } = await import('./authUtils');
    const { ensureBucketExists } = await import('./policyUtils');
    
    // Check authentication (including demo credentials)
    const isAuthenticated = await isAuthenticatedIncludingDemo();
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping storage initialization');
      return false;
    }
    
    // Special handling for demo user
    const isDemoUser = await isUsingDemoCredentials();
    if (isDemoUser) {
      console.log('Demo user detected, simulating storage initialization success');
      return true;
    }
    
    // Create documents bucket if it doesn't exist
    const bucketCreated = await ensureBucketExists('documents', forceBucketCreation, false);
    
    return bucketCreated;
  } catch (error) {
    console.error('Error initializing document storage:', error);
    return false;
  }
};
