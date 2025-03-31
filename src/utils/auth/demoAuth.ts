
/**
 * Utility functions for demo authentication
 */

/**
 * Check if the current user is using the demo authentication
 * @returns {boolean} True if using demo authentication
 */
export const isDemoAuthenticated = (): boolean => {
  // Check if there's a demo flag in localStorage
  const isDemoFlag = localStorage.getItem('demo_auth') === 'true';
  
  // Check if we're in demo/development mode based on URL or environment
  const isDemoEnvironment = 
    window.location.hostname.includes('demo') || 
    window.location.hostname.includes('localhost') ||
    window.location.hostname.includes('127.0.0.1') ||
    window.location.search.includes('demo=true');
  
  return isDemoFlag || isDemoEnvironment;
};

/**
 * Set demo authentication mode
 * @param {boolean} isDemo Whether to enable demo authentication
 */
export const setDemoAuthentication = (isDemo: boolean): void => {
  if (isDemo) {
    localStorage.setItem('demo_auth', 'true');
  } else {
    localStorage.removeItem('demo_auth');
  }
};

/**
 * Get demo user data
 * @returns {object} Demo user data
 */
export const getDemoUser = () => {
  return {
    id: 'demo-user-id',
    email: 'demo@example.com',
    name: 'Demo User',
    role: 'demo',
    isDemo: true
  };
};
