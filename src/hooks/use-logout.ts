
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { clearDemoAuthentication } from '@/utils/auth/demoAuth';

export const useLogout = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { signOut } = useAuth();

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      // Clear demo auth if it was used
      clearDemoAuthentication();
      
      // Perform Supabase signout
      await signOut();
      
      toast.success("Logged out successfully");
      
      // Navigate back to the login page
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleLogout
  };
};
