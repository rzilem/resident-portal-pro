
/**
 * This file is kept for backward compatibility, but all functions 
 * now return values consistent with production mode only.
 */

// Check if credentials match demo account credentials - always returns false now
export const isDemoCredentials = (email: string, password: string): boolean => {
  return false;
};

// Set demo authentication mode - now a no-op function
export const setDemoAuthentication = (isDemo: boolean): void => {
  // No-op - demo mode is disabled
};

// Clear demo authentication - now a no-op function
export const clearDemoAuthentication = (): void => {
  // No-op - demo mode is disabled
};

// Check if user is in demo authentication mode - always returns false now
export const isDemoMode = (): boolean => {
  return false;
};
