
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { User } from '@/types/user';

interface UserManagementTableProps {
  users: User[];
  toggleUserStatus: (id: string) => void;
  openEditDialog: (user: User) => void;
  confirmDeleteUser: (user: User) => void;
}

const UserManagementTable = ({ 
  users, 
  toggleUserStatus, 
  openEditDialog, 
  confirmDeleteUser 
}: UserManagementTableProps) => {
  return (
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
                  aria-label={`Edit ${user.name}`}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => confirmDeleteUser(user)}
                  aria-label={`Delete ${user.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserManagementTable;
