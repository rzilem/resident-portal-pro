
import { User } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { users, profileToUser } from './types';

export const userRetrievalService = {
  getUsers: async (): Promise<User[]> => {
    try {
      console.log('Fetching all users from Supabase...');
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        console.error('Error fetching users from Supabase:', error);
        console.warn('Falling back to local data due to Supabase error');
        return users; // Fallback to local data
      }
      
      console.log(`Retrieved ${profiles?.length || 0} profiles from Supabase`);
      
      if (profiles && profiles.length > 0) {
        // Convert profiles to User objects and return them
        return profiles.map(profileToUser);
      }
      
      console.warn('No profiles found in Supabase, using local data');
      return users; // Fallback to local data if no profiles found
    } catch (error) {
      console.error('Unexpected error in getUsers:', error);
      console.warn('Falling back to local data due to error');
      return users; // Fallback to local data
    }
  },

  getUserById: async (id: string): Promise<User | undefined> => {
    if (!id) return undefined;
    
    try {
      console.log(`Fetching user with ID: ${id} from Supabase`);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error(`Error fetching user by ID (${id}) from Supabase:`, error);
        console.warn('Falling back to local data for user lookup');
        return users.find(user => user.id === id); // Fallback
      }
      
      if (profile) {
        return profileToUser(profile);
      }
      
      console.warn(`No profile found for ID: ${id}`);
      return undefined;
    } catch (error) {
      console.error(`Error in getUserById for ID ${id}:`, error);
      console.warn('Falling back to local data for user lookup');
      return users.find(user => user.id === id); // Fallback
    }
  },

  getUserByEmail: async (email: string): Promise<User | undefined> => {
    if (!email) return undefined;
    
    try {
      const normalizedEmail = email.toLowerCase().trim();
      console.log(`Fetching user with email: ${normalizedEmail} from Supabase`);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', normalizedEmail)
        .single();
      
      if (error) {
        console.error(`Error fetching user by email (${normalizedEmail}) from Supabase:`, error);
        console.warn('Falling back to local data for email lookup');
        // Fallback to local data
        return users.find(user => user.email.toLowerCase() === normalizedEmail);
      }
      
      if (profile) {
        return profileToUser(profile);
      }
      
      console.warn(`No profile found for email: ${normalizedEmail}`);
      return undefined;
    } catch (error) {
      console.error(`Error in getUserByEmail for email ${email}:`, error);
      console.warn('Falling back to local data for email lookup');
      const normalizedEmail = email.toLowerCase().trim();
      return users.find(user => user.email.toLowerCase() === normalizedEmail); // Fallback
    }
  }
};
