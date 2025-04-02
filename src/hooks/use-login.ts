
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { useAuth } from '@/contexts/auth/AuthProvider';

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
      console.log('Attempting signIn with email:', loginValues.email);
      const { error } = await signIn(loginValues.email, loginValues.password);
      
      if (error) {
        console.error("Sign-in error:", error.message);
        toast.error(error.message || "Invalid credentials. Please try again.");
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
