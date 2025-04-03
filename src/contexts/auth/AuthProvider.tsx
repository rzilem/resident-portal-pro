
import * as React from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/supabase';
import { useAuthState } from './useAuthState';
import { useAuthMethods } from './useAuthMethods';

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any, data: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
  resetPassword: (email: string) => Promise<any>; // Add resetPassword to the interface
}

export const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    session, 
    user, 
    profile, 
    loading, 
    isAuthenticated, 
    setSession, 
    setUser,
    setProfile,
    setIsAuthenticated,
    setLoading
  } = useAuthState();

  const { signIn, signUp, signOut, refreshProfile, resetPassword } = useAuthMethods({ 
    user, 
    setUser,
    setProfile, 
    setIsAuthenticated 
  });

  // Set up auth state listener and check for existing session
  React.useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session?.user);
        
        // Delay profile fetch to prevent Supabase auth recursion
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("AuthProvider: Initial session check:", session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      
      // Only set loading to false after we've checked for an existing session
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  return (
    <AuthContext.Provider value={{
      session,
      user,
      profile,
      loading,
      signIn,
      signUp,
      signOut,
      refreshProfile,
      isAuthenticated,
      resetPassword // Add resetPassword to the provider value
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
