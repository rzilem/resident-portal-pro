
import { useState } from 'react';
import { User } from '@/types/user';
import { userService } from '@/services/userService';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface UseUserFormProps {
  editingUser: User | null;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  onSuccess: () => void;
}

interface FormData {
  id?: string;
  name: string;
  email: string;
  role: string;
}

export const useUserForm = ({ 
  editingUser, 
  users, 
  setUsers, 
  onSuccess 
}: UseUserFormProps) => {
  // Initialize with editingUser values or defaults
  const [formData, setFormData] = useState<FormData>({
    id: editingUser?.id || '',
    name: editingUser?.name || '',
    email: editingUser?.email || '',
    // Default role is now 'admin' instead of 'resident'
    role: editingUser?.role || 'admin',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear email error when email is modified
    if (name === 'email') {
      setEmailError(null);
    }
  };
  
  // Handle role selection
  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
  };
  
  // Check if email is already used
  const isEmailDuplicate = (email: string, userId?: string): boolean => {
    return users.some(user => 
      user.email.toLowerCase() === email.toLowerCase() && user.id !== userId
    );
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    
    // Validate email
    if (!formData.email) {
      setEmailError('Email is required');
      return;
    }
    
    if (!formData.email.includes('@')) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    // Check for duplicate email
    if (isEmailDuplicate(formData.email, formData.id)) {
      setEmailError('This email is already in use');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let updatedUser: User;
      
      if (editingUser) {
        // Update existing user
        console.log('Updating user:', { ...formData });
        updatedUser = await userService.updateUser({
          ...editingUser,
          ...formData,
        });
        
        toast.success(`${updatedUser.name} updated successfully`);
        
        // Update users list
        setUsers(users.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        ));
      } else {
        // Create new user
        const newUser: User = {
          id: uuidv4(),
          ...formData,
          status: 'active',
          securityLevel: 'basic',
          createdAt: new Date().toISOString(),
        };
        
        console.log('Creating new user:', newUser);
        updatedUser = await userService.createUser(newUser);
        
        toast.success(`Invitation sent to ${updatedUser.email}`);
        
        // Add to users list
        setUsers([...users, updatedUser]);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    formData,
    isSubmitting,
    emailError,
    handleInputChange,
    handleRoleChange,
    handleSubmit
  };
};
