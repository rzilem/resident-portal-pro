
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  UserCog,
  AlertCircle,
  Info
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from '@/types/user';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface UserManagementTableProps {
  users: User[];
  toggleUserStatus: (id: string) => void;
  openEditDialog: (user: User) => void;
  confirmDeleteUser: (user: User) => void;
}

const getUserStatusBadge = (status: string | undefined) => {
  if (!status) return null;
  
  switch(status.toLowerCase()) {
    case 'active':
      return (
        <Badge variant="success" className="gap-1">
          <CheckCircle className="h-3 w-3" />
          Active
        </Badge>
      );
    case 'pending':
      return (
        <Badge variant="warning" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Pending
        </Badge>
      );
    case 'inactive':
      return (
        <Badge variant="outline" className="gap-1">
          <XCircle className="h-3 w-3" />
          Inactive
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary">{status}</Badge>
      );
  }
};

const UserManagementTable = ({ 
  users, 
  toggleUserStatus, 
  openEditDialog, 
  confirmDeleteUser 
}: UserManagementTableProps) => {
  if (!users || users.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md">
        <div className="flex flex-col items-center justify-center p-4">
          <Info className="h-12 w-12 text-muted-foreground mb-2" />
          <h3 className="font-medium mb-1">No users found</h3>
          <p className="text-muted-foreground mb-4">Add users to get started or refresh to fetch from Supabase.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help">{user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unnamed User'}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>User ID: {user.id}</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.role === 'admin' ? (
                  <Badge variant="destructive" className="gap-1">
                    <UserCog className="h-3 w-3" />
                    Administrator
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="capitalize">
                    {user.role?.replace('_', ' ')}
                  </Badge>
                )}
              </TableCell>
              <TableCell>{getUserStatusBadge(user.status)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditDialog(user)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                      {user.status === 'active' ? (
                        <>
                          <XCircle className="mr-2 h-4 w-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => confirmDeleteUser(user)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserManagementTable;
