
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettings from '@/components/settings/ProfileSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import DisplaySettings from '@/components/settings/DisplaySettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import AssociationSettings from '@/components/settings/AssociationSettings';
import PermissionSettings from '@/components/settings/PermissionSettings';
import IntegrationSettings from '@/components/settings/IntegrationSettings';

const Settings = () => {
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and system settings</p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="associations">Associations</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
        
        <TabsContent value="display">
          <DisplaySettings />
        </TabsContent>
        
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
        
        <TabsContent value="associations">
          <AssociationSettings />
        </TabsContent>
        
        <TabsContent value="permissions">
          <PermissionSettings />
        </TabsContent>
        
        <TabsContent value="integrations">
          <IntegrationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
