
import { useState, useEffect } from 'react';
import { User, UserRole } from '@/types/user';
import { userService } from '@/services/userService';
import { emailService } from '@/services/emailService';
import { toast } from 'sonner';

interface UseUserFormProps {
  editingUser: User | null;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  onSuccess: () => void;
}

export const useUserForm = ({ editingUser, users, setUsers, onSuccess }: UseUserFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'resident' as UserRole,
    firstName: '',
    lastName: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role as UserRole,
        firstName: editingUser.firstName || '',
        lastName: editingUser.lastName || '',
      });
      setEmailError('');
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'resident' as UserRole,
        firstName: '',
        lastName: '',
      });
      setEmailError('');
    }
  }, [editingUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'email') {
      setEmailError('');
    }
    
    if (name === 'firstName' || name === 'lastName') {
      const fullName = name === 'firstName' 
        ? `${value} ${formData.lastName}`.trim()
        : `${formData.firstName} ${value}`.trim();
      
      if (fullName) {
        setFormData(prev => ({ ...prev, name: fullName }));
      }
    }
  };

  const handleRoleChange = (value: UserRole) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const validateEmail = () => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    
    // Check for duplicates, but exclude the current user being edited
    const existingUser = userService.getUserByEmail(formData.email);
    if (existingUser && (!editingUser || existingUser.id !== editingUser.id)) {
      setEmailError('A user with this email already exists');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Form validation
      if (!formData.name || !formData.email || !formData.role) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }
      
      if (!validateEmail()) {
        setIsSubmitting(false);
        return;
      }
      
      if (editingUser) {
        // Update existing user
        const updatedUser = userService.updateUser({
          ...editingUser,
          name: formData.name,
          email: formData.email.trim(),
          role: formData.role,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
        
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        toast.success("User updated successfully");
      } else {
        // Create new user
        const newUser = userService.createUser({
          name: formData.name,
          email: formData.email.trim(),
          role: formData.role,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
        
        // Important: Add the new user to the state
        setUsers(prevUsers => [...prevUsers, newUser]);
        
        await emailService.sendWelcomeEmail(
          newUser.email,
          newUser.firstName || newUser.name,
          getRoleLabel(newUser.role)
        );
        
        const adminUser = users.find(user => user.role === 'admin');
        if (adminUser) {
          await emailService.sendNewUserNotification(
            adminUser.email,
            newUser.name,
            newUser.email,
            getRoleLabel(newUser.role)
          );
        }
        
        toast.success("User invited successfully and welcome email sent");
      }
      
      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(editingUser ? "Failed to update user" : "Failed to invite user");
      }
      console.error("Error saving user:", error);
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

const getRoleLabel = (roleValue: string): string => {
  const role = roles.find(r => r.value === roleValue);
  return role ? role.label : roleValue.charAt(0).toUpperCase() + roleValue.slice(1).replace('_', ' ');
};

const roles: { value: UserRole; label: string }[] = [
  { value: "admin", label: "Administrator" },
  { value: "manager", label: "Property Manager" },
  { value: "board_member", label: "Board Member" },
  { value: "board", label: "Board" },
  { value: "committee", label: "Committee Member" },
  { value: "staff", label: "Staff" },
  { value: "resident", label: "Resident" },
  { value: "guest", label: "Guest" }
];

export { roles };
