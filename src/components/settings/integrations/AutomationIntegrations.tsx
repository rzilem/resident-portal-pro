
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Zap, Link, Workflow, ArrowRight } from "lucide-react";
import IntegrationCard from './IntegrationCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AutomationIntegrations = () => {
  const navigate = useNavigate();

  const handleGoToWorkflows = () => {
    navigate('/workflows');
  };

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="grid gap-6">
        {/* Workflow System Integration */}
        <IntegrationCard 
          title="HOA Workflow Automation"
          description="Create custom workflows for HOA processes like delinquencies, violations, and approvals"
          icon={<Zap className="h-5 w-5" />}
          customActions={
            <Button onClick={handleGoToWorkflows}>
              Go to Workflows <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          }
        />
        
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
