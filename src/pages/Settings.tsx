
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettings from '@/components/settings/ProfileSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import DisplaySettings from '@/components/settings/DisplaySettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import AssociationSettings from '@/components/settings/AssociationSettings';
import PermissionSettings from '@/components/settings/PermissionSettings';
import { useIsMobile } from '@/hooks/use-mobile';

const Settings = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>("profile");
  
  useEffect(() => {
    // Check if we should open the display tab (from sidebar logo click)
    if (sessionStorage.getItem('open-display-settings') === 'true') {
      setActiveTab('display');
      sessionStorage.removeItem('open-display-settings');
    }
  }, []);
  
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-3 md:grid-cols-6'} mb-4`}>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">
            {isMobile ? 'Notif.' : 'Notifications'}
          </TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="associations">
            {isMobile ? 'Assoc.' : 'Associations'}
          </TabsTrigger>
          <TabsTrigger value="permissions">
            {isMobile ? 'Perms.' : 'Permissions'}
          </TabsTrigger>
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
      </Tabs>
    </div>
  );
};

export default Settings;
