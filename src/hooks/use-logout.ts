
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { clearDemoAuthentication } from '@/utils/auth/demoAuth';

export const useLogout = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      console.log('Logout function called');
      
      // Clear demo authentication if active
      clearDemoAuthentication();
      
      // Sign out from Supabase
      await signOut();
      
      toast.success('Successfully signed out');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An unexpected error occurred during logout');
    }
  };

  return { handleLogout };
};
