
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Predefined credentials for internal employee (kept for demo purposes)
export const INTERNAL_CREDENTIALS = {
  email: "admin@residentpro.com",
  password: "admin123"
};

export const useLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const [loginValues, setLoginValues] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginValues({ ...loginValues, [id]: value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // First try Supabase authentication
      const { error } = await signIn(loginValues.email, loginValues.password);
      
      if (error) {
        console.log("Supabase auth error:", error);
        
        // Fallback to demo credentials for development
        if (loginValues.email === INTERNAL_CREDENTIALS.email && 
            loginValues.password === INTERNAL_CREDENTIALS.password) {
          toast.success("Login successful with demo account! Welcome back.");
          
          // Store legacy auth state in localStorage (for backward compatibility)
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userEmail', loginValues.email);
          
          // Navigate to dashboard after successful login
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        } else {
          toast.error(error.message || "Invalid credentials. Please try again.");
        }
      } else {
        toast.success("Login successful! Welcome back.");
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginValues,
    isLoading,
    handleInputChange,
    handleLogin
  };
};
