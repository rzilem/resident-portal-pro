
import { useAuth } from '@/hooks/use-auth';

/**
 * Function to check if a user is authenticated
 * @returns Boolean indicating if a user is authenticated
 */
export const isAuthenticated = (): boolean => {
  // This function is used in contexts where hooks cannot be used
  // For now, we're assuming authentication through localStorage
  // In a real implementation, this would check token validity
  return !!localStorage.getItem('sb-auth-token');
};

/**
 * Check if the user is using demo credentials
 * This is used to determine if certain operations should be restricted
 * @returns Boolean indicating if user is using demo credentials
 */
export const isUsingDemoCredentials = (): boolean => {
  // This can be implemented based on your app's logic
  // E.g., checking for a specific demo user email or a demo flag
  const demoFlag = localStorage.getItem('demo-mode');
  return demoFlag === 'true';
};

/**
 * Get the current user ID
 * @returns The current user ID or null if not authenticated
 */
export const getCurrentUserId = (): string | null => {
  try {
    const authData = localStorage.getItem('sb-auth-data');
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.user?.id || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting current user ID:', error);
    return null;
  }
};

/**
 * Hook to get the current user ID
 * Note: This is a hook and should only be used in React components
 * @returns The current user ID or null if not authenticated
 */
export const useCurrentUserId = (): string | null => {
  const { user } = useAuth();
  return user?.id || null;
};
