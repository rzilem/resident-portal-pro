
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Workflow, Zap, Webhook, GitBranch } from "lucide-react";
import IntegrationCard from './IntegrationCard';

const AutomationIntegrations = () => {
  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="grid gap-6">
        {/* Workflow Automation */}
        <IntegrationCard 
          title="Workflow Automation"
          description="Connect automation platforms to trigger complex workflows"
          icon={<Workflow className="h-5 w-5" />}
          integrations={[
            { 
              name: "Zapier", 
              connected: false,
              apiFields: [
                { name: 'webhookUrl', label: 'Webhook URL', type: 'url', required: true, description: 'The webhook URL from your Zapier trigger' }
              ]
            },
            { 
              name: "Make (Integromat)", 
              connected: false,
              apiFields: [
                { name: 'webhookUrl', label: 'Webhook URL', type: 'url', required: true, description: 'The webhook URL from your Make scenario' }
              ]
            },
            { 
              name: "IFTTT", 
              connected: false,
              apiFields: [
                { name: 'webhookKey', label: 'Webhook Key', type: 'password', required: true },
                { name: 'eventName', label: 'Default Event Name', type: 'text', required: true }
              ]
            }
          ]}
        />
        
        {/* API Integrations */}
        <IntegrationCard 
          title="API & Custom Services"
          description="Connect to custom services and APIs"
          icon={<Zap className="h-5 w-5" />}
          isApiKey={true}
          apiFields={[
            { name: 'apiUrl', label: 'API URL', type: 'url', required: true },
            { name: 'apiKey', label: 'API Key', type: 'password', required: true },
            { name: 'headers', label: 'Additional Headers', type: 'textarea', description: 'Add any additional headers in JSON format', placeholder: '{"X-Custom-Header": "value"}' }
          ]}
        />
        
        {/* Webhook Services */}
        <IntegrationCard 
          title="Webhook Services"
          description="Configure webhooks for external service integration"
          icon={<Webhook className="h-5 w-5" />}
          isWebhook={true}
        />
        
        {/* CI/CD Integration */}
        <IntegrationCard 
          title="CI/CD Integration"
          description="Connect continuous integration and deployment tools"
          icon={<GitBranch className="h-5 w-5" />}
          integrations={[
            { 
              name: "GitHub Actions", 
              connected: false,
              apiFields: [
                { name: 'personalAccessToken', label: 'Personal Access Token', type: 'password', required: true },
                { name: 'repositoryOwner', label: 'Repository Owner', type: 'text', required: true },
                { name: 'repositoryName', label: 'Repository Name', type: 'text', required: true }
              ]
            },
            { 
              name: "CircleCI", 
              connected: false,
              apiFields: [
                { name: 'apiToken', label: 'API Token', type: 'password', required: true },
                { name: 'projectSlug', label: 'Project Slug', type: 'text', required: true, description: 'Format: {vcs-type}/{org-name}/{project-name}' }
              ]
            }
          ]}
        />
      </div>
    </ScrollArea>
  );
};

export default AutomationIntegrations;
