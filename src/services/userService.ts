
import { User, UserRole, SecurityLevel } from '@/types/user';
import { defaultRolePermissions } from '@/components/settings/permissions/constants/securityLevels';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/supabase';

// Local users array for fallback when offline or during development
let users: User[] = [
  { 
    id: '1', 
    name: 'Jane Smith', 
    email: 'jane.smith@example.com', 
    role: 'admin', 
    status: 'active',
    firstName: 'Jane',
    lastName: 'Smith',
    lastLogin: new Date().toISOString(),
    createdAt: '2023-01-15T10:30:00Z',
  },
  { 
    id: '2', 
    name: 'John Doe', 
    email: 'john.doe@example.com', 
    role: 'manager', 
    status: 'active',
    firstName: 'John',
    lastName: 'Doe',
    lastLogin: new Date().toISOString(),
    createdAt: '2023-02-10T14:20:00Z',
  },
  { 
    id: '3', 
    name: 'Alice Johnson', 
    email: 'alice@example.com', 
    role: 'board', 
    status: 'active',
    firstName: 'Alice',
    lastName: 'Johnson',
    lastLogin: new Date().toISOString(),
    createdAt: '2023-03-05T09:15:00Z',
  },
  { 
    id: '4', 
    name: 'Bob Wilson', 
    email: 'bob@example.com', 
    role: 'resident', 
    status: 'pending',
    firstName: 'Bob',
    lastName: 'Wilson',
    createdAt: '2023-04-20T11:45:00Z',
  },
];

// Helper to convert Profile from Supabase to User
const profileToUser = (profile: Profile): User => {
  return {
    id: profile.id,
    name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
    email: profile.email,
    role: profile.role as UserRole,
    status: 'active', // Default status
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    createdAt: profile.created_at || new Date().toISOString(),
    lastLogin: profile.updated_at || new Date().toISOString(),
  };
};

export const userService = {
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
  },

  updateUser: async (updatedUser: User): Promise<User> => {
    try {
      // Check if role has changed to apply the default permissions
      if (updatedUser.id) {
        const existingUser = await userService.getUserById(updatedUser.id);
        if (existingUser && existingUser.role !== updatedUser.role) {
          const roleDefaults = defaultRolePermissions[updatedUser.role as UserRole];
          updatedUser.securityLevel = roleDefaults.securityLevel as SecurityLevel;
        }
      }
      
      // Update the Supabase profile
      const { data, error } = await supabase
        .from('profiles')
        .update({
          first_name: updatedUser.firstName,
          last_name: updatedUser.lastName,
          email: updatedUser.email,
          role: updatedUser.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedUser.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating user in Supabase:', error);
        // Fallback to local data
        const index = users.findIndex(user => user.id === updatedUser.id);
        if (index !== -1) {
          users[index] = { ...users[index], ...updatedUser };
          return users[index];
        }
        throw new Error('User not found');
      }
      
      if (data) {
        return {
          ...profileToUser(data),
          ...updatedUser,
        };
      }
      
      throw new Error('User not found');
    } catch (error) {
      console.error('Error in updateUser:', error);
      // Fallback to local implementation
      const index = users.findIndex(user => user.id === updatedUser.id);
      if (index !== -1) {
        users[index] = { ...users[index], ...updatedUser };
        return users[index];
      }
      throw new Error('User not found');
    }
  },

  createUser: async (user: Omit<User, 'id'>): Promise<User> => {
    // Normalize the email by converting to lowercase and trimming
    const normalizedEmail = user.email.toLowerCase().trim();
    
    try {
      // Check if user with this email already exists
      const existingUser = await userService.getUserByEmail(normalizedEmail);
      if (existingUser) {
        throw new Error('A user with this email already exists');
      }
      
      // Get default permissions based on role
      const roleDefaults = defaultRolePermissions[user.role as UserRole];
      const securityLevel = roleDefaults.securityLevel as SecurityLevel;
      
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
      
      // Ensure profile exists and update it with additional info
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: user.firstName,
          last_name: user.lastName,
          role: user.role
        })
        .eq('id', authUser.user.id)
        .select()
        .single();
      
      if (profileError) {
        console.error('Error updating profile in Supabase:', profileError);
      }
      
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
      users.push(newUser);
      
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
      
      users.push(newUser);
      return newUser;
    }
  },

  deleteUser: async (id: string): Promise<void> => {
    try {
      // Delete the user from Supabase Auth (will cascade delete the profile)
      const { error } = await supabase.auth.admin.deleteUser(id);
      
      if (error) {
        console.error('Error deleting user from Supabase:', error);
        // Fallback to local implementation
        const index = users.findIndex(user => user.id === id);
        if (index !== -1) {
          users.splice(index, 1);
        } else {
          throw new Error('User not found');
        }
        return;
      }
      
      // Remove from local cache as well
      users = users.filter(user => user.id !== id);
    } catch (error) {
      console.error('Error in deleteUser:', error);
      // Fallback to local implementation
      const index = users.findIndex(user => user.id === id);
      if (index !== -1) {
        users.splice(index, 1);
      } else {
        throw new Error('User not found');
      }
    }
  },

  activateUser: async (id: string): Promise<User> => {
    try {
      // Instead of using RPC, update the profile directly with the status
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'active' })
        .eq('id', id);
      
      if (error) {
        console.error('Error activating user in Supabase:', error);
        // Fallback to local implementation
        const index = users.findIndex(user => user.id === id);
        if (index !== -1) {
          users[index].status = 'active';
          return users[index];
        }
        throw new Error('User not found');
      }
      
      const updatedUser = await userService.getUserById(id);
      if (!updatedUser) {
        throw new Error('User not found');
      }
      
      // Also update in local cache
      const index = users.findIndex(user => user.id === id);
      if (index !== -1) {
        users[index].status = 'active';
      }
      
      return {
        ...updatedUser,
        status: 'active'
      };
    } catch (error) {
      console.error('Error in activateUser:', error);
      // Fallback to local implementation
      const index = users.findIndex(user => user.id === id);
      if (index !== -1) {
        users[index].status = 'active';
        return users[index];
      }
      throw new Error('User not found');
    }
  },

  deactivateUser: async (id: string): Promise<User> => {
    try {
      // Instead of using RPC, update the profile directly with the status
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'inactive' })
        .eq('id', id);
      
      if (error) {
        console.error('Error deactivating user in Supabase:', error);
        // Fallback to local implementation
        const index = users.findIndex(user => user.id === id);
        if (index !== -1) {
          users[index].status = 'inactive';
          return users[index];
        }
        throw new Error('User not found');
      }
      
      const updatedUser = await userService.getUserById(id);
      if (!updatedUser) {
        throw new Error('User not found');
      }
      
      // Also update in local cache
      const index = users.findIndex(user => user.id === id);
      if (index !== -1) {
        users[index].status = 'inactive';
      }
      
      return {
        ...updatedUser,
        status: 'inactive'
      };
    } catch (error) {
      console.error('Error in deactivateUser:', error);
      // Fallback to local implementation
      const index = users.findIndex(user => user.id === id);
      if (index !== -1) {
        users[index].status = 'inactive';
        return users[index];
      }
      throw new Error('User not found');
    }
  }
};
