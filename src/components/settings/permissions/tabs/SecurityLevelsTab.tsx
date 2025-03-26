
import React from 'react';
import { User, Edit } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SecurityLevel, UserRole } from "@/types/user";

interface SecurityLevelsTabProps {
  rolePermissions: Record<string, {
    securityLevel: SecurityLevel,
    globalPermission: string,
    modules: Record<string, string>
  }>;
  securityLevelDescriptions: Record<SecurityLevel, string>;
  renderSecurityLevel: (level: SecurityLevel) => JSX.Element;
  setEditingRole: (role: UserRole) => void;
}

const SecurityLevelsTab = ({ 
  rolePermissions, 
  securityLevelDescriptions, 
  renderSecurityLevel, 
  setEditingRole 
}: SecurityLevelsTabProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Role</TableHead>
          <TableHead>Security Level</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(rolePermissions).map(([role, data]) => (
          <TableRow key={role}>
            <TableCell className="font-medium capitalize">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {role.replace('_', ' ')}
              </div>
            </TableCell>
            <TableCell>
              {renderSecurityLevel(data.securityLevel as SecurityLevel)}
            </TableCell>
            <TableCell className="max-w-md">
              {securityLevelDescriptions[data.securityLevel as SecurityLevel]}
            </TableCell>
            <TableCell>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setEditingRole(role as UserRole)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Customize
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SecurityLevelsTab;
