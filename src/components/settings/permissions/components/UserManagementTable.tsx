
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
import { Pencil, CheckCircle, XCircle } from "lucide-react";
import { User, UserRole } from '@/types/user';
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip, 
  TooltipContent,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { format } from 'date-fns';

interface UserManagementTableProps {
  users: User[];
  onEdit: (user: User) => void;
}

const UserManagementTable: React.FC<UserManagementTableProps> = ({ users, onEdit }) => {
  // Get role display name and badge color
  const getRoleBadgeProps = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return { label: 'Administrator', className: 'bg-red-100 text-red-800 hover:bg-red-200' };
      case 'manager':
        return { label: 'Manager', className: 'bg-blue-100 text-blue-800 hover:bg-blue-200' };
      case 'staff':
        return { label: 'Staff', className: 'bg-green-100 text-green-800 hover:bg-green-200' };
      case 'board':
        return { label: 'Board Member', className: 'bg-purple-100 text-purple-800 hover:bg-purple-200' };
      case 'resident':
        return { label: 'Resident', className: 'bg-gray-100 text-gray-800 hover:bg-gray-200' };
      default:
        return { label: role, className: 'bg-gray-100 text-gray-800 hover:bg-gray-200' };
    }
  };
  
  // Get security level display name and color
  const getSecurityLevelProps = (securityLevel: string) => {
    switch (securityLevel) {
      case 'full_access':
        return { label: 'Full Access', className: 'bg-amber-100 text-amber-800 hover:bg-amber-200' };
      case 'advanced':
        return { label: 'Advanced', className: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200' };
      case 'standard':
        return { label: 'Standard', className: 'bg-sky-100 text-sky-800 hover:bg-sky-200' };
      case 'basic':
        return { label: 'Basic', className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' };
      case 'limited':
        return { label: 'Limited', className: 'bg-rose-100 text-rose-800 hover:bg-rose-200' };
      case 'view_only':
        return { label: 'View Only', className: 'bg-slate-100 text-slate-800 hover:bg-slate-200' };
      default:
        return { label: securityLevel, className: 'bg-gray-100 text-gray-800 hover:bg-gray-200' };
    }
  };
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Security</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
              No users found
            </TableCell>
          </TableRow>
        ) : (
          users.map(user => {
            const roleBadge = getRoleBadgeProps(user.role as UserRole);
            const securityBadge = getSecurityLevelProps(user.securityLevel || 'basic');
            
            return (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={roleBadge.className}>
                    {roleBadge.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={securityBadge.className}>
                    {securityBadge.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.status === 'active' ? (
                    <div className="flex items-center">
                      <CheckCircle className="text-green-600 h-4 w-4 mr-1" />
                      <span>Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <XCircle className="text-red-600 h-4 w-4 mr-1" />
                      <span>Inactive</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEdit(user)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit user</p>
                  </TooltipContent>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
};

export default UserManagementTable;
