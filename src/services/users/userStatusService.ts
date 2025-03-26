
import { User } from '@/types/user';
import { users } from './types';
import { userRetrievalService } from './userRetrievalService';

export const userStatusService = {
  activateUser: async (id: string): Promise<User> => {
    try {
      // Since the profiles table doesn't have a status field, we'll update 
      // the metadata in our local user cache but won't update Supabase
      // In a real app, you might store this in a separate table or user_metadata
      
      // Get the user from Supabase if possible
      const updatedUser = await userRetrievalService.getUserById(id);
      if (!updatedUser) {
        throw new Error('User not found');
      }
      
      // Update in local cache
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
      // Since the profiles table doesn't have a status field, we'll update 
      // the metadata in our local user cache but won't update Supabase
      // In a real app, you might store this in a separate table or user_metadata
      
      // Get the user from Supabase if possible
      const updatedUser = await userRetrievalService.getUserById(id);
      if (!updatedUser) {
        throw new Error('User not found');
      }
      
      // Update in local cache
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
