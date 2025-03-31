
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { clearDemoAuthentication } from '@/utils/auth/demoAuth';

export const useLogout = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      // Clear demo authentication if active
      clearDemoAuthentication();
      
      // Sign out from Supabase
      const { error } = await signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast.error('Error signing out. Please try again.');
        return;
      }
      
      toast.success('Successfully signed out');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  return { handleLogout };
};
