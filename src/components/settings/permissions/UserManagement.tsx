
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Users, UserPlus, Edit, Trash2 } from "lucide-react";
import UserDialog from './UserDialog';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface UserManagementProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UserManagement = ({ users, setUsers }: UserManagementProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const openNewUserDialog = () => {
    setEditingUser(null);
    setDialogOpen(true);
  };
  
  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setDialogOpen(true);
  };
  
  const toggleUserStatus = (id: string) => {
    const updatedUsers = users.map(u => {
      if (u.id === id) {
        const newStatus = u.status === 'active' ? 'inactive' : 'active';
        return { ...u, status: newStatus };
      }
      return u;
    });
    setUsers(updatedUsers);
    
    const user = users.find(u => u.id === id);
    toast.success(`${user?.name} ${user?.status === 'active' ? 'deactivated' : 'activated'}`);
  };
  
  const deleteUser = (id: string) => {
    const user = users.find(u => u.id === id);
    const updatedUsers = users.filter(u => u.id !== id);
    setUsers(updatedUsers);
    toast.success(`${user?.name} removed`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>User Management</CardTitle>
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
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
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
                      onClick={() => deleteUser(user.id)}
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
    </Card>
  );
};

export default UserManagement;
