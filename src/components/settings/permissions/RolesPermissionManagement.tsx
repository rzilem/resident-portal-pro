
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Shield } from "lucide-react";
import { toast } from "sonner";
import { UserRole, SecurityLevel } from "@/types/user";
import SecurityLevelsTab from './tabs/SecurityLevelsTab';
import ModulePermissionsTab from './tabs/ModulePermissionsTab';
import FeaturePermissionsTab from './tabs/FeaturePermissionsTab';
import RoleEditDialog from './dialogs/RoleEditDialog';
import { 
  securityLevelIcons,
  securityLevelDescriptions,
  permissionDescriptions,
  rolePermissionsData 
} from './constants/securityLevels';

const RolesPermissionManagement = () => {
  const [rolePermissions, setRolePermissions] = useState(rolePermissionsData);
  const [editingRole, setEditingRole] = useState<UserRole | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const handleSecurityLevelChange = (role: UserRole, level: SecurityLevel) => {
    setRolePermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        securityLevel: level
      }
    }));
    
    // In a real app, you'd save this to your backend
    toast.success(`Security level for ${role} updated to ${level}`);
  };

  const handleModulePermissionChange = (role: UserRole, module: string, permission: string) => {
    setRolePermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        modules: {
          ...prev[role].modules,
          [module]: permission
        }
      }
    }));
    
    toast.success(`Module permission for ${role} updated`);
  };

  const handleFeaturePermissionChange = (role: UserRole, module: string, permission: string, enabled: boolean) => {
    // This would require a more complex implementation to handle individual feature permissions
    // In a real app, you would need to update the specific permission for that feature
    toast.success(`Feature permission ${permission} for ${role} ${enabled ? 'enabled' : 'disabled'}`);
  };
  
  const openEditDialog = (role: UserRole) => {
    setEditingRole(role);
    setIsEditDialogOpen(true);
  };
  
  // Updated to call the function to get the ReactNode
  const renderSecurityLevel = (level: SecurityLevel) => (
    <div className="flex items-center gap-2">
      {securityLevelIcons[level]()}
      <span className="capitalize">{level.replace('_', ' ')}</span>
    </div>
  );

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Role-Based Permissions
            </CardTitle>
            <CardDescription>
              Manage access levels, module permissions, and feature-specific rights by user role
            </CardDescription>
          </div>
          <Button variant="outline" onClick={() => toast.info("Changes to default role permissions will affect all users with these roles")}>
            <Info className="h-4 w-4 mr-2" />
            How this works
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="security-levels">
          <TabsList className="mb-4">
            <TabsTrigger value="security-levels">Security Levels</TabsTrigger>
            <TabsTrigger value="module-permissions">Module Permissions</TabsTrigger>
            <TabsTrigger value="feature-permissions">Feature Permissions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="security-levels">
            <SecurityLevelsTab 
              rolePermissions={rolePermissions}
              securityLevelDescriptions={securityLevelDescriptions}
              renderSecurityLevel={renderSecurityLevel}
              setEditingRole={openEditDialog}
            />
          </TabsContent>
          
          <TabsContent value="module-permissions">
            <ModulePermissionsTab 
              rolePermissions={rolePermissions}
              onPermissionChange={handleModulePermissionChange}
            />
          </TabsContent>

          <TabsContent value="feature-permissions">
            <FeaturePermissionsTab 
              rolePermissions={rolePermissions}
              onPermissionChange={handleFeaturePermissionChange}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setRolePermissions(rolePermissionsData)}>
          Reset to Defaults
        </Button>
        <Button onClick={() => toast.success("Role permissions saved")}>
          Save Changes
        </Button>
      </CardFooter>

      {/* Role edit dialog */}
      <RoleEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        role={editingRole}
        roleData={editingRole ? rolePermissions[editingRole] : undefined}
        onSave={(role, securityLevel, globalPermission) => {
          if (role) {
            handleSecurityLevelChange(role, securityLevel as SecurityLevel);
            setIsEditDialogOpen(false);
            toast.success(`Role "${role}" updated successfully`);
          }
        }}
      />
    </Card>
  );
};

export default RolesPermissionManagement;
