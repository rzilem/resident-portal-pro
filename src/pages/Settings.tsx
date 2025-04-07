
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
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

const Settings = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>("profile");
  const { preferences, savePreferences, isLoading, isSaving } = useSettings();
  const { isAuthenticated, checkAuthentication } = useAuth();
  const [hasChanges, setHasChanges] = useState(false);
  const [originalPreferences, setOriginalPreferences] = useState({});
  
  useEffect(() => {
    // Check if we should open the display tab (from sidebar logo click)
    if (sessionStorage.getItem('open-display-settings') === 'true') {
      setActiveTab('display');
      sessionStorage.removeItem('open-display-settings');
    }
  }, []);
  
  // Store original preferences for change detection
  useEffect(() => {
    if (!isLoading && preferences) {
      setOriginalPreferences(JSON.stringify(preferences));
    }
  }, [isLoading, preferences]);
  
  // Check for changes whenever preferences update
  useEffect(() => {
    if (originalPreferences && preferences) {
      const currentPrefs = JSON.stringify(preferences);
      setHasChanges(currentPrefs !== originalPreferences);
    }
  }, [preferences, originalPreferences]);
  
  const handleResetDefaults = async () => {
    const isAuth = await checkAuthentication();
    
    if (!isAuth) {
      toast.warning('You must be logged in to reset settings');
      return;
    }
    
    await savePreferences({
      theme: 'system',
      cardStyle: 'default',
      colorMode: 'default',
      fontSize: 'medium',
      tableDensity: 'default',
      voiceGreetingEnabled: true,
      voiceGreetingType: 'default'
    });
    
    toast.success('Settings reset to defaults');
    setHasChanges(false);
  };
  
  const handleSaveAll = async () => {
    const isAuth = await checkAuthentication();
    
    if (!isAuth) {
      toast.warning('You must be logged in to save settings');
      return;
    }
    
    const success = await savePreferences(preferences);
    if (success) {
      toast.success('All settings saved successfully');
      // Update the original preferences to match current state
      setOriginalPreferences(JSON.stringify(preferences));
      setHasChanges(false);
    } else {
      toast.error('Failed to save some settings');
    }
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
            disabled={isSaving || isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </TooltipButton>
          <TooltipButton
            tooltipText="Save all settings"
            onClick={handleSaveAll}
            disabled={!hasChanges || isSaving || isLoading}
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
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
