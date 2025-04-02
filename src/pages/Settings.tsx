
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettings from '@/components/settings/ProfileSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import DisplaySettings from '@/components/settings/DisplaySettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import AssociationSettings from '@/components/settings/AssociationSettings';
import PermissionSettings from '@/components/settings/PermissionSettings';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Save, RefreshCw } from 'lucide-react';
import { TooltipButton } from '@/components/ui/tooltip-button';
import { useSettings } from '@/hooks/use-settings';

const Settings = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>("profile");
  const { preferences, savePreferences } = useSettings();
  
  useEffect(() => {
    // Check if we should open the display tab (from sidebar logo click)
    if (sessionStorage.getItem('open-display-settings') === 'true') {
      setActiveTab('display');
      sessionStorage.removeItem('open-display-settings');
    }
  }, []);
  
  const handleResetDefaults = () => {
    savePreferences({
      theme: 'system',
      cardStyle: 'default',
      colorMode: 'default',
      fontSize: 'medium',
      tableDensity: 'default',
      voiceGreetingEnabled: true,
      voiceGreetingType: 'default'
    });
  };
  
  const handleSaveAll = () => {
    savePreferences(preferences);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Settings</h1>
        <div className="flex gap-2">
          <TooltipButton
            variant="outline"
            tooltipText="Reset to defaults"
            onClick={handleResetDefaults}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </TooltipButton>
          <TooltipButton
            tooltipText="Save all settings"
            onClick={handleSaveAll}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </TooltipButton>
        </div>
      </div>
      
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
