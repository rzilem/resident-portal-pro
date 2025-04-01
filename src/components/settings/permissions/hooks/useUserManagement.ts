
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load users on component mount
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching users...");
      const fetchedUsers = await userService.getUsers();
      console.log("Fetched users:", fetchedUsers);
      
      // Filter out resident users - only show admin and staff type users
      const filteredUsers = fetchedUsers.filter(user => 
        user.role !== 'resident'
      );
      
      console.log("Filtered non-resident users:", filteredUsers);
      
      // Ensure all users have unique IDs to avoid rendering issues
      const uniqueUsers = removeDuplicateUsers(filteredUsers);
      setUsers(uniqueUsers);
    } catch (error) {
      toast.error("Failed to load users");
      console.error("Error loading users:", error);
    } finally {
      setIsLoading(false);
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
    console.log("Opening edit dialog for user:", user);
    setEditingUser(user);
    setDialogOpen(true);
  };
  
  const toggleUserStatus = async (id: string) => {
    try {
      const user = users.find(u => u.id === id);
      if (!user) return;

      console.log(`Toggling status for user ${user.name} (${id}) from ${user.status}`);
      
      let updatedUser;
      if (user.status === 'active') {
        updatedUser = await userService.deactivateUser(id);
        toast.success(`${user.name} deactivated`);
      } else {
        updatedUser = await userService.activateUser(id);
        toast.success(`${user.name} activated`);
      }

      console.log("Updated user:", updatedUser);
      
      const updatedUsers = users.map(u => 
        u.id === id ? updatedUser : u
      );
      setUsers(updatedUsers);
    } catch (error) {
      toast.error("Failed to update user status");
      console.error("Error updating user status:", error);
    }
  };
  
  const confirmDeleteUser = (user: User) => {
    console.log("Confirming deletion of user:", user);
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const deleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      console.log("Deleting user:", userToDelete);
      await userService.deleteUser(userToDelete.id);
      
      // Important: Only filter out the specific user with matching ID
      setUsers(users.filter(u => u.id !== userToDelete.id));
      toast.success(`User deleted successfully`);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      toast.error("Failed to delete user");
      console.error("Error deleting user:", error);
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
    isLoading,
    openNewUserDialog,
    openEditDialog,
    toggleUserStatus,
    confirmDeleteUser,
    deleteUser,
    refreshUsers: loadUsers
  };
};
