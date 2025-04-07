
import { User } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { users, profileToUser } from './types';
import { adaptSupabaseUser } from '@/utils/user-helpers';

export const userRetrievalService = {
  getUsers: async (): Promise<User[]> => {
    try {
      console.log('Fetching all users from Supabase...');
      
      // First get all auth users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error fetching auth users from Supabase:', authError);
        console.warn('Falling back to profiles table for user data');
        
        // Fallback to profiles table if we can't access auth users
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*');
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          console.warn('Using local data due to Supabase errors');
          return users; // Final fallback to local data
        }
        
        if (profiles && profiles.length > 0) {
          console.log(`Retrieved ${profiles.length} profiles from Supabase`);
          return profiles.map(profileToUser);
        }
        
        return users;
      }
      
      if (authUsers && authUsers.users.length > 0) {
        console.log(`Retrieved ${authUsers.users.length} users from Supabase auth`);
        
        // Get profiles to enrich user data
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*');
        
        // Map of profiles by user ID for fast lookup
        const profileMap = new Map();
        if (profiles) {
          profiles.forEach(profile => {
            profileMap.set(profile.id, profile);
          });
        }
        
        // Create enriched user objects by combining auth users with profile data
        const enrichedUsers = authUsers.users.map(authUser => {
          const profile = profileMap.get(authUser.id);
          const baseUser = adaptSupabaseUser(authUser);
          
          if (profile) {
            return {
              ...baseUser,
              firstName: profile.first_name || baseUser.firstName,
              lastName: profile.last_name || baseUser.lastName,
              name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || baseUser.name,
              role: profile.role || baseUser.role,
              phoneNumber: profile.phone_number,
              profileImageUrl: profile.profile_image_url,
              createdAt: authUser.created_at,
              updatedAt: profile.updated_at
            };
          }
          
          return baseUser;
        });
        
        return enrichedUsers;
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
