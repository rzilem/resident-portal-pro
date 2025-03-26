
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PermissionSettings from '@/components/settings/PermissionSettings';
import RolesPermissionManagement from '@/components/settings/permissions/RolesPermissionManagement';
import DocumentSecuritySettings from '@/components/settings/permissions/DocumentSecuritySettings';
import DocumentAccess from '@/components/settings/permissions/DocumentAccess';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, Info, Users, Lock, ShieldCheck, ShieldAlert, FolderIcon } from "lucide-react";

const PermissionsPage = () => {
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Security & Permissions
        </h1>
        <p className="text-muted-foreground">
          Manage user access levels, security settings and role-based permissions
        </p>
      </div>

      <Alert variant="default" className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
        <Info className="h-4 w-4" />
        <AlertTitle>Security best practices</AlertTitle>
        <AlertDescription>
          Follow the principle of least privilege: grant users only the permissions they need. 
          Regularly review access levels and audit user permissions.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="roles">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="roles">
            <Shield className="h-4 w-4 mr-2" />
            Role Permissions
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="documents">
            <Lock className="h-4 w-4 mr-2" />
            Document Access
          </TabsTrigger>
          <TabsTrigger value="folders">
            <FolderIcon className="h-4 w-4 mr-2" />
            Folder Security
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="roles">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Levels Overview</CardTitle>
                <CardDescription>Understanding the different security levels in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    { level: 'restricted', title: 'Restricted', color: 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800', icon: <Shield className="h-5 w-5 text-red-500" />, description: 'Very limited access to specific features only' },
                    { level: 'basic', title: 'Basic', color: 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800', icon: <Shield className="h-5 w-5 text-blue-500" />, description: 'Standard access for regular users' },
                    { level: 'elevated', title: 'Elevated', color: 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800', icon: <Shield className="h-5 w-5 text-green-500" />, description: 'Extended permissions for trusted users' },
                    { level: 'advanced', title: 'Advanced', color: 'bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-800', icon: <ShieldCheck className="h-5 w-5 text-purple-500" />, description: 'High level access for managers/supervisors' },
                    { level: 'full', title: 'Full Access', color: 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800', icon: <ShieldAlert className="h-5 w-5 text-amber-500" />, description: 'Complete system access for administrators' }
                  ].map((item) => (
                    <Card key={item.level} className={`border ${item.color}`}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          {item.icon}
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 text-sm">
                        {item.description}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <RolesPermissionManagement />
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <PermissionSettings />
        </TabsContent>
        
        <TabsContent value="documents">
          <div className="py-4">
            <DocumentAccess />
          </div>
        </TabsContent>
        
        <TabsContent value="folders">
          <div className="py-4">
            <DocumentSecuritySettings />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PermissionsPage;
