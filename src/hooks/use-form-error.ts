
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseFormErrorReturn {
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
  handleError: (error: unknown) => void;
}

/**
 * Hook for handling form errors consistently
 */
export const useFormError = (): UseFormErrorReturn => {
  const [error, setError] = useState<string | null>(null);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  const handleError = useCallback((error: unknown) => {
    let message = "An unexpected error occurred";
    
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      message = String(error.message);
    }
    
    console.error('Form error:', error);
    setError(message);
    toast.error(message);
    
    return message;
  }, []);
  
  return {
    error,
    setError,
    clearError,
    handleError
  };
};
