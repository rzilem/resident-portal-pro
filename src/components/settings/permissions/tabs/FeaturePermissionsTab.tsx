
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { UserRole, moduleFeatures, FeaturePermission } from '@/types/user';

interface FeaturePermissionsTabProps {
  rolePermissions: Record<string, { 
    securityLevel: string; 
    globalPermission: string; 
    modules: Record<string, string> 
  }>;
  onPermissionChange: (role: UserRole, module: string, permission: string, enabled: boolean) => void;
}

const FeaturePermissionsTab = ({ rolePermissions, onPermissionChange }: FeaturePermissionsTabProps) => {
  const getRolePermissions = (role: string, module: string) => {
    const permissions = rolePermissions[role]?.modules[module];
    
    if (permissions === 'admin') {
      return { canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true };
    } else if (permissions === 'edit') {
      return { canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: false };
    } else if (permissions === 'create') {
      return { canView: true, canCreate: true, canEdit: false, canDelete: false, canApprove: false };
    } else if (permissions === 'view') {
      return { canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false };
    } else if (permissions === 'approve') {
      return { canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: true };
    } else {
      return { canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false };
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Feature</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Enabled</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(moduleFeatures).map(([module, features]) => (
          <React.Fragment key={module}>
            <TableRow>
              <TableCell colSpan={3} className="font-semibold text-sm uppercase">
                {module}
              </TableCell>
            </TableRow>
            {features.map((feature: FeaturePermission) => (
              <TableRow key={feature.id}>
                <TableCell className="font-medium">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-2">
                        {feature.name}
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        {feature.description}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>{feature.description}</TableCell>
                <TableCell>
                  <Switch 
                    checked={feature.enabled}
                    onCheckedChange={(enabled) => onPermissionChange(
                      'admin', // Replace with actual role
                      module,
                      feature.id,
                      enabled
                    )}
                  />
                </TableCell>
              </TableRow>
            ))}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export default FeaturePermissionsTab;
