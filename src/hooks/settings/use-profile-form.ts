
import { useState, useEffect } from 'react';
import { ProfileFormValues } from '@/components/settings/profile/types';
import { useAuth } from '@/hooks/use-auth';

type UseProfileFormProps = {
  initialData?: Partial<ProfileFormValues>;
  onUpdate?: (data: Partial<ProfileFormValues>) => Promise<void> | void;
  isReadOnly?: boolean;
};

const defaultFormValues: ProfileFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  address: '',
  bio: '',
};

export function useProfileForm({
  initialData,
  onUpdate,
  isReadOnly = false,
}: UseProfileFormProps = {}) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ProfileFormValues>({
    ...defaultFormValues,
    ...initialData,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...defaultFormValues,
        ...initialData,
      });
    }
  }, [initialData]);

  const isAdmin = user?.role === 'admin';

  const handleInputChange = (field: keyof ProfileFormValues) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error for this field if any
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const startEditing = () => {
    if (isReadOnly && !isAdmin) return;
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    // Reset form to initial data
    if (initialData) {
      setFormData({
        ...defaultFormValues,
        ...initialData,
      });
    }
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveChanges = async () => {
    if (isReadOnly && !isAdmin) return;
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      if (onUpdate) {
        await onUpdate(formData);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors({ form: 'Failed to save changes. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formData,
    isEditing,
    isSaving,
    errors,
    isAdmin,
    isReadOnly,
    handleInputChange,
    startEditing,
    cancelEditing,
    saveChanges,
  };
}
