
/**
 * Utilities for demo authentication
 */

// Check if credentials match demo account credentials
export const isDemoCredentials = (email: string, password: string): boolean => {
  const demoEmail = "demo@example.com";
  const demoPassword = "demo123";
  
  return email.toLowerCase() === demoEmail && password === demoPassword;
};

// Set demo authentication mode
export const setDemoAuthentication = (isDemo: boolean): void => {
  if (isDemo) {
    localStorage.setItem('demoAuth', 'true');
  } else {
    localStorage.removeItem('demoAuth');
  }
};

// Clear demo authentication
export const clearDemoAuthentication = (): void => {
  localStorage.removeItem('demoAuth');
};

// Check if user is in demo authentication mode
export const isDemoMode = (): boolean => {
  return localStorage.getItem('demoAuth') === 'true';
};
