
import { useState, useEffect } from 'react';
import { User, UserRole } from '@/types/user';
import { userService } from '@/services/userService';
import { emailService } from '@/services/emailService';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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

  const validateEmail = async () => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    
    try {
      // Check for duplicates, but exclude the current user being edited
      const existingUser = await userService.getUserByEmail(formData.email);
      if (existingUser && (!editingUser || existingUser.id !== editingUser.id)) {
        setEmailError('A user with this email already exists');
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error validating email:", error);
      return false;
    }
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
      
      const isEmailValid = await validateEmail();
      if (!isEmailValid) {
        setIsSubmitting(false);
        return;
      }
      
      if (editingUser) {
        // Update existing user
        const updatedUser = await userService.updateUser({
          ...editingUser,
          name: formData.name,
          email: formData.email.trim(),
          role: formData.role,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
        
        // Update the users array with the updated user
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
        toast.success("User updated successfully");
      } else {
        try {
          // Create new user - this will throw an error if the email already exists
          const newUser = await userService.createUser({
            name: formData.name,
            email: formData.email.trim(),
            role: formData.role,
            firstName: formData.firstName,
            lastName: formData.lastName,
          });
          
          // Important: Only add the new user to the state if creation was successful
          setUsers(prevUsers => [...prevUsers, newUser]);
          
          // Send welcome email with better error handling
          try {
            const emailSent = await emailService.sendWelcomeEmail(
              newUser.email,
              newUser.firstName || newUser.name,
              getRoleLabel(newUser.role)
            );
            
            if (emailSent) {
              console.log(`Welcome email successfully sent to ${newUser.email}`);
            } else {
              console.error(`Failed to send welcome email to ${newUser.email}`);
              toast.warning("User created but welcome email could not be sent");
            }
          } catch (emailError) {
            console.error("Error sending welcome email:", emailError);
            toast.warning("User created but welcome email could not be sent");
            // Don't throw - we still want to create the user even if email fails
          }
          
          // Send admin notification
          try {
            const adminUser = users.find(user => user.role === 'admin');
            if (adminUser && adminUser.email) {
              const notificationSent = await emailService.sendNewUserNotification(
                adminUser.email,
                newUser.name,
                newUser.email,
                getRoleLabel(newUser.role)
              );
              
              if (notificationSent) {
                console.log(`Admin notification email sent to ${adminUser.email}`);
              } else {
                console.error(`Failed to send admin notification to ${adminUser.email}`);
              }
            } else {
              console.log("No admin user found to notify about new user");
            }
          } catch (notificationError) {
            console.error("Error sending admin notification:", notificationError);
            // Don't throw - we still want to create the user even if notification fails
          }
          
          toast.success("User invited successfully and welcome email sent");
        } catch (createError) {
          // Handle user creation errors
          if (createError instanceof Error) {
            toast.error(createError.message);
          } else {
            toast.error("Failed to create user");
          }
          console.error("Error creating user:", createError);
          setIsSubmitting(false);
          return;
        }
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
