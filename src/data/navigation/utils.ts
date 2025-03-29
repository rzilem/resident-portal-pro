
import { useLocation } from "react-router-dom";

/**
 * Determines if a path is active based on the current location
 * @param path The path to check
 * @param currentPath The current location path
 * @param exact If true, only exact matches are considered active
 * @returns Whether the path is active
 */
export const isPathActive = (path: string, currentPath: string, exact: boolean = false): boolean => {
  if (exact) {
    return path === currentPath;
  }
  
  // Special case for dashboard to avoid marking everything as active
  if (path === '/dashboard' || path === '/') {
    return currentPath === '/dashboard' || currentPath === '/';
  }
  
  return currentPath.startsWith(path);
};

/**
 * Hook that returns a function to check if a path is active
 */
export const useActivePath = () => {
  const location = useLocation();
  
  return (path: string, exact: boolean = false) => {
    return isPathActive(path, location.pathname, exact);
  };
};
