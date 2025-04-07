
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/user';
import { adaptSupabaseUser } from '@/utils/user-helpers';
import { Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize authentication state
  useEffect(() => {
    // First set up the auth state change listener to capture future changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      const adaptedUser = session ? adaptSupabaseUser(session.user) : null;
      setUser(adaptedUser);
      setIsAuthenticated(!!session);
      setIsLoading(false);
      
      // Log authentication status change for debugging
      console.log('Auth state changed:', { event, adaptedUser });
    });

    // Then check the current session state
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      const adaptedUser = data.session ? adaptSupabaseUser(data.session.user) : null;
      setUser(adaptedUser);
      setIsAuthenticated(!!data.session);
      setIsLoading(false);
      
      // Log the current session state for debugging
      console.log('Current session:', { 
        hasSession: !!data.session, 
        adaptedUser
      });
    });

    // Cleanup subscription when component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        throw error;
      }
      return { success: true };
    } catch (error) {
      console.error('Error signing in:', error);
      return { success: false, error };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      return { success: false, error };
    }
  };

  // Check if user is authenticated
  const checkAuthentication = async (): Promise<boolean> => {
    try {
      const { data } = await supabase.auth.getSession();
      const isAuth = !!data.session;
      
      // Update state if needed
      if (isAuth !== isAuthenticated) {
        setIsAuthenticated(isAuth);
        const adaptedUser = data.session ? adaptSupabaseUser(data.session.user) : null;
        setUser(adaptedUser);
      }
      
      return isAuth;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
    checkAuthentication,
  };
}
