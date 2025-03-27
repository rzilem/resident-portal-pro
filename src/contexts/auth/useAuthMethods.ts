
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/supabase';

interface UseAuthMethodsProps {
  user: User | null;
  setProfile: (profile: Profile | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useAuthMethods = ({ 
  user, 
  setProfile,
  setIsAuthenticated 
}: UseAuthMethodsProps) => {

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      } else {
        // Reset authentication state
        setIsAuthenticated(false);
        setProfile(null);
      }
    } catch (error) {
      console.error('Exception during sign out:', error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      console.log("Refreshing profile for user:", user.id);
      await fetchProfile(user.id);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      console.log("Fetched profile data:", data);
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    refreshProfile
  };
};
