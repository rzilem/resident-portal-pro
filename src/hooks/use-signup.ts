
import { useState } from 'react';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const [signupValues, setSignupValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSignupValues({ ...signupValues, [id.replace('-register', '')]: value });
  };

  const handleSignup = async (e: React.FormEvent, switchToLoginTab: () => void) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!signupValues.firstName || !signupValues.lastName) {
      toast.error("Please provide your first and last name.");
      setIsLoading(false);
      return;
    }
    
    try {
      const { error, data } = await signUp(
        signupValues.email, 
        signupValues.password, 
        {
          first_name: signupValues.firstName,
          last_name: signupValues.lastName
        }
      );
      
      if (error) {
        toast.error(error.message || "Registration failed. Please try again.");
      } else {
        toast.success(
          "Registration successful! You can now sign in.", 
          { duration: 5000 }
        );
        // Switch to login tab
        switchToLoginTab();
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signupValues,
    isLoading,
    handleInputChange,
    handleSignup
  };
};
