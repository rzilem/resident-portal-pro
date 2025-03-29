
import { useState, useCallback } from 'react';
import { useFormError } from './use-form-error';
import { toast } from 'sonner';

interface UseFormStateProps<T> {
  initialState: T;
  onSubmit?: (data: T) => Promise<void> | void;
  successMessage?: string;
  resetOnSuccess?: boolean;
}

interface UseFormStateReturn<T> {
  formState: T;
  setFormState: React.Dispatch<React.SetStateAction<T>>;
  error: string | null;
  isSubmitting: boolean;
  success: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  resetForm: () => void;
  setFieldValue: (field: keyof T, value: any) => void;
}

/**
 * Hook for managing form state with error handling
 */
export const useFormState = <T extends Record<string, any>>({
  initialState,
  onSubmit,
  successMessage = "Form submitted successfully",
  resetOnSuccess = false
}: UseFormStateProps<T>): UseFormStateReturn<T> => {
  const [formState, setFormState] = useState<T>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { error, setError, clearError, handleError } = useFormError();
  
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    clearError();
    setSuccess(false);
  }, [clearError]);
  
  const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setFormState(prev => ({
      ...prev,
      [name]: checked
    }));
    
    clearError();
    setSuccess(false);
  }, [clearError]);
  
  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
    
    clearError();
    setSuccess(false);
  }, [clearError]);
  
  const resetForm = useCallback(() => {
    setFormState(initialState);
    clearError();
    setSuccess(false);
  }, [initialState, clearError]);
  
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!onSubmit) return;
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    
    try {
      await onSubmit(formState);
      setSuccess(true);
      toast.success(successMessage);
      
      if (resetOnSuccess) {
        resetForm();
      }
    } catch (err) {
      handleError(err);
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  }, [formState, onSubmit, resetOnSuccess, resetForm, handleError, setError, successMessage]);
  
  return {
    formState,
    setFormState,
    error,
    isSubmitting,
    success,
    handleChange,
    handleCheckboxChange,
    handleSubmit,
    resetForm,
    setFieldValue
  };
};
