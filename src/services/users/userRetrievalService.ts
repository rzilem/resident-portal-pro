
import { User } from '@/types/user';
import { supabase } from '@/lib/supabase';
import { users, profileToUser } from './types';

export const userRetrievalService = {
  getUsers: async (): Promise<User[]> => {
    try {
      console.log('Fetching all users from Supabase...');
      
      // First try to get users from profiles table 
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        console.warn('Falling back to local data');
        return users; // Return local data as fallback
      }
      
      if (profiles && profiles.length > 0) {
        console.log(`Retrieved ${profiles.length} profiles from Supabase`);
        // Convert profiles to User objects
        const mappedUsers = profiles.map(profileToUser);
        return mappedUsers;
      }
      
      // If no profiles found, try to get auth users with getUser
      const { data: authSession } = await supabase.auth.getSession();
      if (authSession?.session) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Create a simple user object with available data
          const currentUser: User = {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            firstName: user.user_metadata?.first_name || '',
            lastName: user.user_metadata?.last_name || '',
            role: user.user_metadata?.role || 'admin', // Default to admin for testing
            status: 'active',
            securityLevel: 'full_access',
            createdAt: user.created_at,
            updatedAt: user.updated_at
          };
          return [currentUser];
        }
      }
      
      console.warn('No users found in Supabase, using local data');
      return users; // Fallback to local data
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
