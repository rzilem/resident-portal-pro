
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { useAuth } from '@/contexts/auth/AuthProvider';
import { isDemoCredentials, setDemoAuthentication } from '@/utils/auth/demoAuth';

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
        if (isDemoCredentials(loginValues.email, loginValues.password)) {
          setDemoAuthentication();
          
          // Navigate to dashboard after successful login
          toast.success("Login successful with demo account! Welcome back.");
          navigate('/dashboard');
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
