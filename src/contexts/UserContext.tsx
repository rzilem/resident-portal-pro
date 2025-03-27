
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/supabase';
import { toast } from 'sonner';

type UserContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshProfile: () => Promise<void>;
  updateUserProfile: (updates: Partial<Profile>) => Promise<void>;
  checkPermission: (module: string, permission: string) => boolean;
  isAdmin: boolean;
  isManager: boolean;
  isBoardMember: boolean;
  isResident: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Setup auth state listener and check for existing session
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session?.user);
        
        // Use setTimeout to prevent potential Supabase auth recursion issues
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
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

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  const updateUserProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      toast.error('You must be logged in to update your profile');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        toast.error('Failed to update profile');
        console.error('Error updating profile:', error);
        return;
      }

      toast.success('Profile updated successfully');
      setProfile(data);
    } catch (error) {
      toast.error('An error occurred while updating your profile');
      console.error('Exception in updateUserProfile:', error);
    }
  };

  const checkPermission = (module: string, permission: string): boolean => {
    if (!profile || !profile.role) return false;
    
    // Basic role-based permissions
    if (profile.role === 'admin') return true;
    
    // Check for manager permissions
    if (profile.role === 'manager') {
      // Managers can do everything except certain admin functions
      if (permission === 'admin') return false;
      return true;
    }
    
    // Check for board member permissions
    if (profile.role === 'board_member' || profile.role === 'board') {
      // Board members can view most things and approve some things
      if (permission === 'view' || permission === 'approve') return true;
      if (module === 'communications' && (permission === 'create' || permission === 'edit')) return true;
      return false;
    }
    
    // Check for resident permissions
    if (profile.role === 'resident') {
      // Residents can view public information and create maintenance requests
      if (permission === 'view' && (
        module === 'properties' || 
        module === 'documents' || 
        module === 'communications' || 
        module === 'calendar'
      )) return true;
      
      if (module === 'maintenance' && permission === 'create') return true;
      return false;
    }
    
    return false;
  };

  // Computed role properties for convenience
  const isAdmin = profile?.role === 'admin';
  const isManager = profile?.role === 'manager';
  const isBoardMember = profile?.role === 'board_member' || profile?.role === 'board';
  const isResident = profile?.role === 'resident';

  return (
    <UserContext.Provider value={{
      session,
      user,
      profile,
      loading,
      isAuthenticated,
      refreshProfile,
      updateUserProfile,
      checkPermission,
      isAdmin,
      isManager,
      isBoardMember,
      isResident
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
