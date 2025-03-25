
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/types/user";

interface ModulePermissionsTabProps {
  rolePermissions: Record<UserRole, {
    securityLevel: string,
    globalPermission: string,
    modules: Record<string, string>
  }>;
}

const ModulePermissionsTab = ({ rolePermissions }: ModulePermissionsTabProps) => {
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
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Module</TableHead>
            {Object.keys(rolePermissions).map(role => (
              <TableHead key={role} className="text-center capitalize">{role}</TableHead>
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
                  {getPermissionBadge(data.modules[module] || 'none')}
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
