
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import IntegrationSettings from '@/components/settings/IntegrationSettings';

const Integrations = () => {
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
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="text-muted-foreground">
          Connect your system with third-party services and tools. Toggle an integration on to configure and save its API settings.
        </p>
      </div>
      
      <IntegrationSettings />
    </div>
  );
};

export default Integrations;
