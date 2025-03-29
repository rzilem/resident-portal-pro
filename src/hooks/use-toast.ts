
import { toast as sonnerToast } from "sonner";

// Export the toast function directly from sonner
export const toast = sonnerToast;

// Create a hook that returns the toast function for use in components
export const useToast = () => {
  return {
    toast: sonnerToast
  };
};
