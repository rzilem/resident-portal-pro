
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Users, UserPlus, Edit, Trash2 } from "lucide-react";
import UserDialog from './UserDialog';
import { userService } from '@/services/userService';
import { User } from '@/types/user';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface UserManagementProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UserManagement = ({ users, setUsers }: UserManagementProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    // Load users on component mount
    const loadUsers = async () => {
      try {
        const fetchedUsers = userService.getUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        toast.error("Failed to load users");
        console.error(error);
      }
    };

    loadUsers();
  }, [setUsers]);
  
  const openNewUserDialog = () => {
    setEditingUser(null);
    setDialogOpen(true);
  };
  
  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setDialogOpen(true);
  };
  
  const toggleUserStatus = (id: string) => {
    try {
      const user = users.find(u => u.id === id);
      if (!user) return;

      let updatedUser;
      if (user.status === 'active') {
        updatedUser = userService.deactivateUser(id);
        toast.success(`${user.name} deactivated`);
      } else {
        updatedUser = userService.activateUser(id);
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

  const deleteUser = () => {
    if (!userToDelete) return;
    
    try {
      userService.deleteUser(userToDelete.id);
      setUsers(users.filter(u => u.id !== userToDelete.id));
      toast.success(`${userToDelete.name} removed`);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      toast.error("Failed to delete user");
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>Manage users and their roles in the system</CardDescription>
        </div>
        <Button onClick={openNewUserDialog}>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.name}
                </TableCell>
                <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                <TableCell>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1).replace('_', ' ')}
                  </div>
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={user.status === 'active'} 
                    onCheckedChange={() => toggleUserStatus(user.id)} 
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => openEditDialog(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => confirmDeleteUser(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      
      <UserDialog 
        open={dialogOpen} 
        setOpen={setDialogOpen}
        editingUser={editingUser}
        users={users}
        setUsers={setUsers}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteUser} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default UserManagement;
