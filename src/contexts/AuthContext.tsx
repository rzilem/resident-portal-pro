// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://eqbbnewrorxilukaocjx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxYmJuZXdyb3J4aWx1a2FvY2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMDk1OTksImV4cCI6MjA1ODU4NTU5OX0.VR0HEuV67Sp6js9tujvAqut0uf6342baidyAvQLwKaQ';
const supabase = createClient(supabaseUrl, supabaseKey);

// Define the type for our context
interface AuthContextType {
  user: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  supabase: typeof supabase;
}

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({}),
  logout: async () => {},
  supabase: supabase,
});

// Custom hook to use the auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if a user is already logged in
  useEffect(() => {
    console.log('AuthContext: Initializing auth state listener');
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user);
      setUser(session?.user || null);
      setLoading(false);
    });

    // Get the current session
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('AuthContext: Error getting session:', error);
      } else {
        console.log('AuthContext: Initial session:', session?.user);
        setUser(session?.user || null);
      }
      setLoading(false);
    };
    getSession();

    // Cleanup listener on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    console.log('AuthContext: Attempting login with email:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('AuthContext: Login error:', error.message);
      throw error;
    }
    console.log('AuthContext: Login successful:', data.user);
    return data;
  };

  // Logout function
  const logout = async () => {
    console.log('AuthContext: Logging out');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('AuthContext: Logout error:', error.message);
      throw error;
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, supabase }}>
      {children}
    </AuthContext.Provider>
  );
};
