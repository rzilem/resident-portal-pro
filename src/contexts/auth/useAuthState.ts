
import * as React from 'react';
import { Session, User } from '@supabase/supabase-js';
import { Profile } from '@/types/supabase';

export const useAuthState = () => {
  const [session, setSession] = React.useState<Session | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  return {
    session,
    user,
    profile,
    loading,
    isAuthenticated,
    setSession,
    setUser,
    setProfile,
    setLoading,
    setIsAuthenticated
  };
};
