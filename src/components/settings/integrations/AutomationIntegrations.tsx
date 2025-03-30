
import React from 'react';
import { Grid } from 'lucide-react';
import IntegrationCard from './IntegrationCard';
import { Volume2, MessageSquare, Bot, Webhook } from 'lucide-react';

const AutomationIntegrations: React.FC = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <IntegrationCard
        title="ElevenLabs"
        description="Connect to ElevenLabs for high-quality voice synthesis"
        icon={<Volume2 className="h-5 w-5 text-primary" />}
        isElevenLabs={true}
      />
      
      <IntegrationCard
        title="X.AI"
        description="Use X.AI's Grok models for AI-powered text generation"
        icon={<MessageSquare className="h-5 w-5 text-primary" />}
        isXAI={true}
      />
      
      <IntegrationCard
        title="Zapier"
        description="Connect your workflows to thousands of apps with Zapier webhooks"
        icon={<Grid className="h-5 w-5 text-primary" />}
        isWebhook={true}
      />
      
      <IntegrationCard
        title="Webhook Endpoints"
        description="Configure webhook endpoints for external services to connect to your app"
        icon={<Webhook className="h-5 w-5 text-primary" />}
        isWebhookEndpoint={true}
      />
    </div>
  );
};

export default AutomationIntegrations;
