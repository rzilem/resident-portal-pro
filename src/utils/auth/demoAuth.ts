
/**
 * Demo authentication utilities
 * These functions provide fallback authentication for the demo user
 */

import { toast } from "sonner";

// Predefined credentials for internal employee (kept for demo purposes)
export const INTERNAL_CREDENTIALS = {
  email: "admin@residentpro.com",
  password: "admin123"
};

/**
 * Check if credentials match the demo user credentials
 */
export const isDemoCredentials = (email: string, password: string): boolean => {
  return email === INTERNAL_CREDENTIALS.email && password === INTERNAL_CREDENTIALS.password;
}

/**
 * Set demo user authentication in localStorage
 */
export const setDemoAuthentication = () => {
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('userEmail', INTERNAL_CREDENTIALS.email);
  toast.success("Login successful with demo account! Welcome back.");
}

/**
 * Check if the current user is authenticated as the demo user
 */
export const isDemoAuthenticated = (): boolean => {
  const isAuth = localStorage.getItem('isAuthenticated') === 'true';
  const email = localStorage.getItem('userEmail');
  return isAuth && email === INTERNAL_CREDENTIALS.email;
}

/**
 * Clear demo authentication from localStorage
 */
export const clearDemoAuthentication = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userEmail');
}
