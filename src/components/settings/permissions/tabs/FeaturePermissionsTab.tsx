
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { moduleFeatures, FeaturePermission, UserRole } from '@/types/user';
import { roleService } from '@/services/roleService';

interface FeaturePermissionsTabProps {
  rolePermissions: Record<UserRole, any>;
  onPermissionChange?: (role: UserRole, module: string, permission: string, enabled: boolean) => void;
}

const FeaturePermissionsTab: React.FC<FeaturePermissionsTabProps> = ({ rolePermissions, onPermissionChange }) => {
  const [activeModule, setActiveModule] = useState<string>("calendar");
  const moduleTabs = Object.keys(moduleFeatures);
  
  // Check if a role has permission for a specific feature
  const hasFeaturePermission = (role: UserRole, module: string, feature: FeaturePermission): boolean => {
    const permissions = roleService.getRolePermissions(role)[module];
    if (!permissions) return false;
    
    // Check if the role has the specific permission needed for this feature
    return permissions.includes(feature.requiredPermission) || permissions.includes('admin');
  };
  
  const handlePermissionToggle = (role: UserRole, module: string, feature: FeaturePermission, checked: boolean) => {
    if (onPermissionChange) {
      onPermissionChange(role, module, feature.requiredPermission, checked);
    }
  };
  
  return (
    <div className="space-y-4">
      <Tabs value={activeModule} onValueChange={setActiveModule}>
        <TabsList className="mb-4 flex flex-wrap">
          {moduleTabs.map((module) => (
            <TabsTrigger key={module} value={module} className="capitalize">
              {module}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {moduleTabs.map((module) => (
          <TabsContent key={module} value={module}>
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{module} Feature Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Feature</TableHead>
                      {Object.keys(rolePermissions).map((role) => (
                        <TableHead key={role} className="text-center capitalize">{role.replace('_', ' ')}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {moduleFeatures[module].map((feature) => (
                      <TableRow key={feature.feature}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {feature.feature}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{feature.description}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Required permission: 
                                    <Badge variant="outline" className="ml-1">
                                      {feature.requiredPermission}
                                    </Badge>
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                        
                        {Object.keys(rolePermissions).map((role) => (
                          <TableCell key={role} className="text-center">
                            <Checkbox 
                              checked={hasFeaturePermission(role as UserRole, module, feature)}
                              onCheckedChange={(checked) => 
                                handlePermissionToggle(role as UserRole, module, feature, checked as boolean)
                              }
                              disabled={role === 'admin'} // Admin role always has all permissions
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FeaturePermissionsTab;
