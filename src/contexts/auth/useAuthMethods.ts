
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/supabase';

interface UseAuthMethodsProps {
  user: User | null;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useAuthMethods = ({ 
  user, 
  setUser,
  setProfile,
  setIsAuthenticated 
}: UseAuthMethodsProps) => {

  const signIn = async (email: string, password: string) => {
    try {
      console.log("useAuthMethods: Starting sign-in process for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("useAuthMethods: Sign-in error:", error);
        return { error };
      }
      
      console.log("useAuthMethods: Sign-in successful for user:", data.user?.id);
      
      // Manually update state to avoid race conditions
      setUser(data.user);
      setIsAuthenticated(true);
      
      // Force a session refresh to ensure everything is synced
      await supabase.auth.getSession();
      
      return { error: null };
    } catch (error) {
      console.error("useAuthMethods: Exception during sign in:", error);
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
        setUser(null);
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
