
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Association } from '@/types/association';
import { useAssociationSettings } from '@/hooks/use-association-settings';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

interface AssociationSettingsTabProps {
  association: Association;
}

const AssociationSettingsTab: React.FC<AssociationSettingsTabProps> = ({ association }) => {
  const [activeTab, setActiveTab] = useState('modules');
  const { 
    settings, 
    isLoading, 
    updateSettings, 
    toggleModule 
  } = useAssociationSettings(association.id);
  
  // Handler for module toggle
  const handleModuleToggle = async (module: string, checked: boolean) => {
    await toggleModule(module, checked);
  };
  
  // Handler for email settings
  const handleEmailSettingsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    await updateSettings('communications', {
      emailEnabled: formData.get('emailEnabled') === 'on',
      smsEnabled: formData.get('smsEnabled') === 'on',
      defaultEmailSender: formData.get('defaultEmailSender')
    });
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }
  
  return (
    <div className="mt-4 space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="accounting">Accounting</TabsTrigger>
          <TabsTrigger value="residents">Residents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="modules">
          <Card>
            <CardHeader>
              <CardTitle>Module Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(settings.modules).map(([module, enabled]) => (
                  <div key={module} className="flex items-center justify-between">
                    <div>
                      <Label htmlFor={`module-${module}`} className="capitalize">
                        {module.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {enabled ? 'Enabled' : 'Disabled'} for this association
                      </p>
                    </div>
                    <Switch 
                      id={`module-${module}`}
                      checked={enabled}
                      onCheckedChange={(checked) => handleModuleToggle(module, checked)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="communications">
          <Card>
            <CardHeader>
              <CardTitle>Communication Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSettingsSubmit}>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailEnabled">Email Communications</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable email notifications for this association
                      </p>
                    </div>
                    <Switch 
                      id="emailEnabled"
                      name="emailEnabled"
                      checked={settings.communications.emailEnabled}
                      defaultChecked={settings.communications.emailEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="smsEnabled">SMS Communications</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable text message notifications
                      </p>
                    </div>
                    <Switch 
                      id="smsEnabled"
                      name="smsEnabled"
                      checked={settings.communications.smsEnabled}
                      defaultChecked={settings.communications.smsEnabled}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultEmailSender">Default Sender Email</Label>
                    <Input 
                      id="defaultEmailSender"
                      name="defaultEmailSender"
                      placeholder="noreply@yourdomain.com"
                      defaultValue={settings.communications.defaultEmailSender || ''}
                    />
                    <p className="text-sm text-muted-foreground">
                      Email address used as the sender for notifications
                    </p>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">Save Communication Settings</Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="accounting">
          <Card>
            <CardHeader>
              <CardTitle>Accounting Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Configure accounting settings for this association.
              </p>
              {/* Add accounting settings here */}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="residents">
          <Card>
            <CardHeader>
              <CardTitle>Resident Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Configure resident portal settings for this association.
              </p>
              {/* Add resident settings here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssociationSettingsTab;
