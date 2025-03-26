
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { UserRole } from "@/types/user";

interface ModulePermissionsTabProps {
  rolePermissions: Record<UserRole, {
    securityLevel: string,
    globalPermission: string,
    modules: Record<string, string>
  }>;
  onPermissionChange?: (role: UserRole, module: string, permission: string) => void;
}

const ModulePermissionsTab = ({ rolePermissions, onPermissionChange }: ModulePermissionsTabProps) => {
  const getPermissionBadge = (permission: string) => {
    switch(permission) {
      case 'admin':
        return <Badge className="bg-purple-500">Admin</Badge>;
      case 'approve':
        return <Badge className="bg-amber-500">Approve</Badge>;
      case 'delete':
        return <Badge className="bg-red-500">Delete</Badge>;
      case 'edit':
        return <Badge className="bg-blue-500">Edit</Badge>;
      case 'create':
        return <Badge className="bg-green-500">Create</Badge>;
      case 'view':
        return <Badge className="bg-slate-500">View</Badge>;
      case 'none':
      default:
        return <Badge variant="outline" className="text-muted-foreground">None</Badge>;
    }
  };

  const permissions = ['admin', 'approve', 'delete', 'edit', 'create', 'view', 'none'];
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Module</TableHead>
            {Object.keys(rolePermissions).map(role => (
              <TableHead key={role} className="text-center capitalize">{role.replace('_', ' ')}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {(['properties', 'accounting', 'communications', 'calendar', 
             'documents', 'reports', 'settings', 'residents', 'maintenance'] as const).map(module => (
            <TableRow key={module}>
              <TableCell className="font-medium capitalize">
                {module}
              </TableCell>
              {Object.entries(rolePermissions).map(([role, data]) => (
                <TableCell key={role} className="text-center">
                  {onPermissionChange ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 flex items-center gap-1">
                          {getPermissionBadge(data.modules[module] || 'none')}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center">
                        {permissions.map(permission => (
                          <DropdownMenuItem 
                            key={permission}
                            onClick={() => onPermissionChange(role as UserRole, module, permission)}
                            className="justify-center"
                          >
                            {getPermissionBadge(permission)}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    getPermissionBadge(data.modules[module] || 'none')
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ModulePermissionsTab;
