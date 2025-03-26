
import { User } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { users, profileToUser } from './types';

export const userRetrievalService = {
  getUsers: async (): Promise<User[]> => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        console.error('Error fetching users from Supabase:', error);
        return users; // Fallback to local data
      }
      
      if (profiles && profiles.length > 0) {
        return profiles.map(profileToUser);
      }
      
      return users; // Fallback to local data if no profiles found
    } catch (error) {
      console.error('Error in getUsers:', error);
      return users; // Fallback to local data
    }
  },

  getUserById: async (id: string): Promise<User | undefined> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching user by ID from Supabase:', error);
        return users.find(user => user.id === id); // Fallback
      }
      
      if (profile) {
        return profileToUser(profile);
      }
      
      return undefined;
    } catch (error) {
      console.error('Error in getUserById:', error);
      return users.find(user => user.id === id); // Fallback
    }
  },

  getUserByEmail: async (email: string): Promise<User | undefined> => {
    if (!email) return undefined;
    
    try {
      const normalizedEmail = email.toLowerCase().trim();
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', normalizedEmail)
        .single();
      
      if (error) {
        console.error('Error fetching user by email from Supabase:', error);
        // Fallback to local data
        return users.find(user => user.email.toLowerCase() === normalizedEmail);
      }
      
      if (profile) {
        return profileToUser(profile);
      }
      
      return undefined;
    } catch (error) {
      console.error('Error in getUserByEmail:', error);
      const normalizedEmail = email.toLowerCase().trim();
      return users.find(user => user.email.toLowerCase() === normalizedEmail); // Fallback
    }
  }
};
