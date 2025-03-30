
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import IntegrationSettings from '@/components/settings/IntegrationSettings';
import ElevenLabsTest from '@/components/settings/integrations/ElevenLabsTest';

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
    <div className="animate-fade-in space-y-6">
      <IntegrationSettings />
      <ElevenLabsTest />
    </div>
  );
};

export default Integrations;
