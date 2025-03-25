
import React from 'react';
import IntegrationSettings from '@/components/settings/IntegrationSettings';

const Integrations = () => {
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="text-muted-foreground">Connect your system with third-party services and tools</p>
      </div>
      
      <IntegrationSettings />
    </div>
  );
};

export default Integrations;
