
import { User, UserRole, SecurityLevel } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { addUserToCache } from './types';
import { defaultRolePermissions } from '@/components/settings/permissions/constants/securityLevels';
import { userRetrievalService } from './userRetrievalService';
import { toast } from 'sonner';

export const userCreationService = {
  createUser: async (user: Omit<User, 'id'>): Promise<User> => {
    // Normalize the email by converting to lowercase and trimming
    const normalizedEmail = user.email.toLowerCase().trim();
    
    try {
      // Check if user with this email already exists
      const existingUser = await userRetrievalService.getUserByEmail(normalizedEmail);
      if (existingUser) {
        throw new Error('A user with this email already exists');
      }
      
      // Get default permissions based on role
      const roleDefaults = defaultRolePermissions[user.role as UserRole];
      const securityLevel = roleDefaults.securityLevel as SecurityLevel;
      
      console.log('Creating new user:', { ...user, email: normalizedEmail });
      
      // Generate a unique ID
      const { data: authUser, error: signUpError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), // Random password
        options: {
          data: {
            first_name: user.firstName,
            last_name: user.lastName,
            role: user.role
          }
        }
      });

      if (signUpError) {
        console.error('Error signing up user in Supabase:', signUpError);
        throw signUpError;
      }
      
      if (!authUser.user) {
        throw new Error('Failed to create user in Supabase Auth');
      }
      
      console.log('User created successfully in Auth:', authUser.user.id);
      
      // Create the new user object
      const newUser: User = { 
        ...user, 
        id: authUser.user.id, 
        email: normalizedEmail,
        createdAt: new Date().toISOString(),
        securityLevel,
        status: 'pending' // New users start as pending until they accept the invitation
      };
      
      // Add to local cache
      addUserToCache(newUser);
      
      return newUser;
    } catch (error) {
      console.error('Error in createUser:', error);
      if (error instanceof Error && error.message === 'A user with this email already exists') {
        throw error;
      }
      
      // If Supabase fails, fall back to local implementation with a unique ID
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 11);
      const uniqueId = `${timestamp}-${randomString}`;
      
      const roleDefaults = defaultRolePermissions[user.role as UserRole];
      const securityLevel = roleDefaults.securityLevel as SecurityLevel;
      
      const newUser: User = { 
        ...user, 
        id: uniqueId, 
        email: normalizedEmail,
        createdAt: new Date().toISOString(),
        securityLevel,
        status: 'pending'
      };
      
      addUserToCache(newUser);
      return newUser;
    }
  }
};
