
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/supabase';
import { ensureStorageBucket } from '@/utils/supabase/ensureStorageBucket';

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
  setIsAuthenticated,
}: UseAuthMethodsProps) => {
  const signIn = async (email: string, password: string) => {
    try {
      // First make sure the storage bucket exists
      await ensureStorageBucket('profile_photos', true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      return { error };
    } catch (error) {
      console.error('Error in signIn:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      // Ensure that the profile_photos bucket exists
      await ensureStorageBucket('profile_photos', true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      return { data, error };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { error, data: null };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error in signOut:', error);
    }
  };

  const refreshProfile = async () => {
    if (!user) return;

    console.log("Refreshing profile for user:", user.id);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Error refreshing profile:', error);
        return;
      }
      
      console.log("Fetched profile data:", data);
      setProfile(data);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  return { signIn, signUp, signOut, refreshProfile };
};
