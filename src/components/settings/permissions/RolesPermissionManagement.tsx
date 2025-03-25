
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Info, Shield, ShieldCheck, ShieldAlert, User, Eye, EyeOff, Edit, Lock } from "lucide-react";
import { toast } from "sonner";
import { UserRole, SecurityLevel, GlobalPermission, ModulePermissions } from "@/types/user";

const securityLevelIcons: Record<SecurityLevel, React.ReactNode> = {
  'restricted': <Shield className="h-4 w-4 text-red-500" />,
  'basic': <Shield className="h-4 w-4 text-blue-500" />,
  'elevated': <Shield className="h-4 w-4 text-green-500" />,
  'advanced': <ShieldCheck className="h-4 w-4 text-purple-500" />,
  'full': <ShieldAlert className="h-4 w-4 text-amber-500" />
};

const securityLevelDescriptions: Record<SecurityLevel, string> = {
  'restricted': 'Very limited access to specific features only',
  'basic': 'Standard access for regular users',
  'elevated': 'Extended permissions for trusted users',
  'advanced': 'High level access for managers/supervisors',
  'full': 'Complete system access for administrators'
};

const defaultRolePermissions: Record<UserRole, {
  securityLevel: SecurityLevel,
  globalPermission: GlobalPermission,
  modules: Partial<Record<keyof ModulePermissions, string>>
}> = {
  'admin': {
    securityLevel: 'full',
    globalPermission: 'admin',
    modules: {
      properties: 'admin',
      accounting: 'admin', 
      communications: 'admin',
      calendar: 'admin',
      documents: 'admin',
      reports: 'admin',
      settings: 'admin',
      residents: 'admin',
      maintenance: 'admin'
    }
  },
  'manager': {
    securityLevel: 'advanced',
    globalPermission: 'manage',
    modules: {
      properties: 'edit',
      accounting: 'edit',
      communications: 'edit',
      calendar: 'edit',
      documents: 'edit',
      reports: 'view',
      settings: 'edit',
      residents: 'edit',
      maintenance: 'approve'
    }
  },
  'board': {
    securityLevel: 'elevated',
    globalPermission: 'contribute',
    modules: {
      properties: 'view',
      accounting: 'view',
      communications: 'create',
      calendar: 'edit',
      documents: 'view',
      reports: 'view',
      settings: 'none',
      residents: 'view',
      maintenance: 'create'
    }
  },
  'committee': {
    securityLevel: 'elevated',
    globalPermission: 'contribute',
    modules: {
      properties: 'view',
      accounting: 'none',
      communications: 'create',
      calendar: 'edit',
      documents: 'view',
      reports: 'view',
      settings: 'none',
      residents: 'view',
      maintenance: 'view'
    }
  },
  'resident': {
    securityLevel: 'basic',
    globalPermission: 'read',
    modules: {
      properties: 'view',
      accounting: 'view',
      communications: 'view',
      calendar: 'view',
      documents: 'view',
      reports: 'none',
      settings: 'none',
      residents: 'none',
      maintenance: 'create'
    }
  },
  'guest': {
    securityLevel: 'restricted',
    globalPermission: 'none',
    modules: {
      properties: 'none',
      accounting: 'none',
      communications: 'none',
      calendar: 'view',
      documents: 'none',
      reports: 'none',
      settings: 'none',
      residents: 'none',
      maintenance: 'none'
    }
  }
};

const RolesPermissionManagement = () => {
  const [rolePermissions, setRolePermissions] = useState(defaultRolePermissions);
  const [editingRole, setEditingRole] = useState<UserRole | null>(null);
  
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
  
  const renderSecurityLevel = (level: SecurityLevel) => (
    <div className="flex items-center gap-2">
      {securityLevelIcons[level]}
      <span className="capitalize">{level}</span>
    </div>
  );
  
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
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Role-Based Permissions
            </CardTitle>
            <CardDescription>
              Manage access levels and permissions by user role
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
          </TabsList>
          
          <TabsContent value="security-levels">
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
                        {role}
                      </div>
                    </TableCell>
                    <TableCell>
                      {renderSecurityLevel(data.securityLevel)}
                    </TableCell>
                    <TableCell className="max-w-md">
                      {securityLevelDescriptions[data.securityLevel]}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => setEditingRole(role as UserRole)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Customize
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="module-permissions">
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
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setRolePermissions(defaultRolePermissions)}>
          Reset to Defaults
        </Button>
        <Button onClick={() => toast.success("Role permissions saved")}>
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RolesPermissionManagement;
