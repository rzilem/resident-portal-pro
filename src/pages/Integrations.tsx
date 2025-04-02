
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import IntegrationSettings from '@/components/settings/IntegrationSettings';
import ElevenLabsTest from '@/components/settings/integrations/ElevenLabsTest';
import XAITest from '@/components/settings/integrations/XAITest';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Integrations = () => {
  const [activeTab, setActiveTab] = React.useState("settings");

  useEffect(() => {
    // Show a welcome toast when the page is first visited
    const hasShownWelcome = sessionStorage.getItem('integrations-welcome-shown');
    if (!hasShownWelcome) {
      toast.success(
        "Integration settings now save your API configurations when toggled on.",
        { duration: 5000 }
      );
      sessionStorage.setItem('integrations-welcome-shown', 'true');
    }
  }, []);

  return (
    <div className="animate-fade-in space-y-6">
      <Tabs defaultValue="settings" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full max-w-md mx-auto mb-6">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="test">Test Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings" className="space-y-6">
          <IntegrationSettings />
        </TabsContent>
        
        <TabsContent value="test" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ElevenLabsTest />
            <XAITest />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Integrations;
