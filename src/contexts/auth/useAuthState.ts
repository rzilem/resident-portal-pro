
import { useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { Profile } from '@/types/supabase';

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return {
    // State
    session,
    user,
    profile,
    loading,
    isAuthenticated,
    
    // State setters
    setSession,
    setUser,
    setProfile,
    setLoading,
    setIsAuthenticated
  };
};
