
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Zap, Link } from "lucide-react";
import IntegrationCard from './IntegrationCard';

const AutomationIntegrations = () => {
  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="grid gap-6">
        {/* Zapier Integration */}
        <IntegrationCard 
          title="Zapier"
          description="Connect Zapier to automate workflows with thousands of apps"
          icon={<Zap className="h-5 w-5" />}
          isWebhook={true}
        />
        
        {/* API Access */}
        <IntegrationCard 
          title="API Access"
          description="Generate API keys to integrate with custom applications"
          icon={<Link className="h-5 w-5" />}
          isApiKey={true}
        />
        
        {/* Webhook Endpoints */}
        <IntegrationCard 
          title="Webhook Endpoints"
          description="Create webhook endpoints to receive data from external services"
          icon={<Link className="h-5 w-5" />}
          isWebhookEndpoint={true}
        />
      </div>
    </ScrollArea>
  );
};

export default AutomationIntegrations;
