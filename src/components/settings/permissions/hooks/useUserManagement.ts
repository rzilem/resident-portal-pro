import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { userService } from '@/services/userService';
import { toast } from "sonner";

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    // Load users on component mount
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const fetchedUsers = await userService.getUsers();
      // Ensure all users have unique IDs to avoid rendering issues
      const uniqueUsers = removeDuplicateUsers(fetchedUsers);
      setUsers(uniqueUsers);
    } catch (error) {
      toast.error("Failed to load users");
      console.error(error);
    }
  };
  
  // Helper function to remove duplicate users by email
  const removeDuplicateUsers = (userList: User[]): User[] => {
    const emailMap = new Map<string, User>();
    
    // Keep only the most recently created user for each email
    userList.forEach(user => {
      const email = user.email.toLowerCase();
      const existingUser = emailMap.get(email);
      
      // If this is the first user with this email, or if this one is newer, keep it
      if (!existingUser || 
          (user.createdAt && existingUser.createdAt && 
           new Date(user.createdAt) > new Date(existingUser.createdAt))) {
        emailMap.set(email, user);
      }
    });
    
    return Array.from(emailMap.values());
  };
  
  const openNewUserDialog = () => {
    setEditingUser(null);
    setDialogOpen(true);
  };
  
  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setDialogOpen(true);
  };
  
  const toggleUserStatus = async (id: string) => {
    try {
      const user = users.find(u => u.id === id);
      if (!user) return;

      let updatedUser;
      if (user.status === 'active') {
        updatedUser = await userService.deactivateUser(id);
        toast.success(`${user.name} deactivated`);
      } else {
        updatedUser = await userService.activateUser(id);
        toast.success(`${user.name} activated`);
      }

      const updatedUsers = users.map(u => 
        u.id === id ? updatedUser : u
      );
      setUsers(updatedUsers);
    } catch (error) {
      toast.error("Failed to update user status");
      console.error(error);
    }
  };
  
  const confirmDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const deleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      await userService.deleteUser(userToDelete.id);
      // Important: Only filter out the specific user with matching ID
      setUsers(users.filter(u => u.id !== userToDelete.id));
      toast.success(`User deleted successfully`);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      toast.error("Failed to delete user");
      console.error(error);
    }
  };

  return {
    users,
    setUsers,
    dialogOpen,
    setDialogOpen,
    editingUser,
    setEditingUser,
    deleteDialogOpen,
    setDeleteDialogOpen,
    userToDelete,
    setUserToDelete,
    openNewUserDialog,
    openEditDialog,
    toggleUserStatus,
    confirmDeleteUser,
    deleteUser
  };
};
