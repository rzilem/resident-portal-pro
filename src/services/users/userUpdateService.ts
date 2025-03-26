
import { User, UserRole, SecurityLevel } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { users, updateUserInCache, profileToUser } from './types';
import { defaultRolePermissions } from '@/components/settings/permissions/constants/securityLevels';
import { userRetrievalService } from './userRetrievalService';

export const userUpdateService = {
  updateUser: async (updatedUser: User): Promise<User> => {
    try {
      // Check if role has changed to apply the default permissions
      if (updatedUser.id) {
        const existingUser = await userRetrievalService.getUserById(updatedUser.id);
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
        updateUserInCache(updatedUser.id, updatedUser);
        const updatedUserInCache = users.find(user => user.id === updatedUser.id);
        if (!updatedUserInCache) {
          throw new Error('User not found');
        }
        return updatedUserInCache;
      }
      
      if (data) {
        const result = {
          ...profileToUser(data),
          ...updatedUser,
        };
        updateUserInCache(result.id, result);
        return result;
      }
      
      throw new Error('User not found');
    } catch (error) {
      console.error('Error in updateUser:', error);
      // Fallback to local implementation
      updateUserInCache(updatedUser.id, updatedUser);
      const updatedUserInCache = users.find(user => user.id === updatedUser.id);
      if (!updatedUserInCache) {
        throw new Error('User not found');
      }
      return updatedUserInCache;
    }
  }
};
