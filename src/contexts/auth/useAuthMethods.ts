
import * as React from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UseAuthMethodsProps {
  user: User | null;
  setUser: (user: User | null) => void;
  setProfile: (profile: any | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useAuthMethods = ({ user, setUser, setProfile, setIsAuthenticated }: UseAuthMethodsProps) => {
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { data, error };
  };

  const signUp = async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: userData,
        emailRedirectTo: window.location.origin + '/login'
      }
    });
    
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsAuthenticated(false);
  };

  const refreshProfile = async () => {
    if (!user) return;

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
      
      setProfile(data);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  return { signIn, signUp, signOut, refreshProfile };
};
