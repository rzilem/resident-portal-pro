
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIntegrations } from '@/hooks/use-integrations';
import APIConfigForm, { APIConfigFormProps } from './APIConfigForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

// Import the new components
import IntegrationList from './IntegrationList';
import ApiKeyContent from './content/ApiKeyContent';
import WebhookContent from './content/WebhookContent';
import WebhookEndpointContent from './content/WebhookEndpointContent';
import ApiKeyDialog from './dialogs/ApiKeyDialog';
import WebhookDialog from './dialogs/WebhookDialog';
import WebhookEndpointDialog from './dialogs/WebhookEndpointDialog';

interface Integration {
  name: string;
  connected: boolean;
  apiFields?: APIConfigFormProps['fields'];
}

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  integrations?: Integration[];
  isApiKey?: boolean;
  isWebhook?: boolean;
  isWebhookEndpoint?: boolean;
  customActions?: React.ReactNode;
  apiFields?: APIConfigFormProps['fields'];
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  title,
  description,
  icon,
  integrations,
  isApiKey,
  isWebhook,
  isWebhookEndpoint,
  customActions,
  apiFields
}) => {
  const [open, setOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [showConfigForm, setShowConfigForm] = useState(false);
  
  const { 
    connectIntegration, 
    disconnectIntegration, 
    updateIntegrationSettings, 
    testWebhook,
    isConnected,
    getIntegration
  } = useIntegrations();

  const handleConnect = async (name: string) => {
    try {
      // For integrations with API fields, show config form instead of auto-connecting
      const integration = integrations?.find(i => i.name === name);
      if (integration?.apiFields && integration.apiFields.length > 0) {
        setSelectedIntegration(name);
        setShowConfigForm(true);
        setOpen(true);
        return;
      }
      
      // Simple toggle-only integrations
      await connectIntegration(name, { enabled: true });
      toast.success(`Connected to ${name}`);
    } catch (error) {
      console.error('Error connecting:', error);
      toast.error(`Failed to connect to ${name}`);
    }
  };

  const handleDisconnect = async (name: string) => {
    try {
      await disconnectIntegration(name);
      toast.success(`Disconnected from ${name}`);
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast.error(`Failed to disconnect from ${name}`);
    }
  };

  const handleSaveAPIConfig = async (values: Record<string, any>) => {
    if (!selectedIntegration) return;
    
    try {
      await updateIntegrationSettings(selectedIntegration, {
        ...values,
        enabled: true
      });
      
      setOpen(false);
      setShowConfigForm(false);
      toast.success(`API configuration saved for ${selectedIntegration}`);
    } catch (error) {
      console.error('Error saving API configuration:', error);
      toast.error('Failed to save API configuration');
    }
  };

  const handleSaveApiKey = async () => {
    if (!selectedIntegration) return;
    
    try {
      await updateIntegrationSettings(selectedIntegration, {
        apiKey,
        enabled: true
      });
      
      setOpen(false);
      toast.success(`API key saved for ${selectedIntegration}`);
    } catch (error) {
      console.error('Error saving API key:', error);
      toast.error('Failed to save API key');
    }
  };

  const handleSaveWebhook = async () => {
    if (!selectedIntegration) return;
    
    try {
      await updateIntegrationSettings(selectedIntegration, {
        webhookUrl,
        enabled: true
      });
      
      setOpen(false);
      toast.success(`Webhook URL saved for ${selectedIntegration}`);
    } catch (error) {
      console.error('Error saving webhook URL:', error);
      toast.error('Failed to save webhook URL');
    }
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl) {
      toast.error('Please enter a webhook URL first');
      return;
    }
    
    try {
      await testWebhook(webhookUrl, {
        service: selectedIntegration,
        action: 'test'
      });
    } catch (error) {
      console.error('Error testing webhook:', error);
    }
  };

  const handleTestConnection = async (values: Record<string, any>) => {
    if (!selectedIntegration) return false;
    
    try {
      // This is a simplified test; in a real app, you'd test with the actual service
      const result = await testWebhook(values.apiUrl || 'https://example.com', {
        service: selectedIntegration,
        credentials: 'test'
      });
      return result;
    } catch (error) {
      console.error('Error testing connection:', error);
      return false;
    }
  };

  const getIntegrationConfig = (name: string) => {
    const integration = getIntegration(name);
    if (!integration) return {};
    
    // Filter out non-user-configurable fields and convert to appropriate format
    const {enabled, lastSync, ...config} = integration;
    return config;
  };

  const handleOpenConfigForm = (name: string) => {
    setSelectedIntegration(name);
    setShowConfigForm(true);
    setOpen(true);
  };

  const handleOpenApiKeyDialog = () => {
    setSelectedIntegration(title);
    setShowConfigForm(false);
    setOpen(true);
  };

  const handleOpenWebhookDialog = () => {
    setSelectedIntegration(title);
    setShowConfigForm(false);
    setOpen(true);
  };

  const handleOpenWebhookEndpointDialog = () => {
    setSelectedIntegration(title);
    setShowConfigForm(false);
    setOpen(true);
  };

  // Render API Config Form Dialog
  const renderConfigFormDialog = () => {
    if (!selectedIntegration) return null;
    
    // Get fields from either the integration or the card's apiFields
    let fields: APIConfigFormProps['fields'] = [];
    
    if (integrations) {
      const integration = integrations.find(i => i.name === selectedIntegration);
      if (integration?.apiFields) {
        fields = integration.apiFields;
      }
    } else if (apiFields) {
      fields = apiFields;
    }
    
    const initialValues = getIntegrationConfig(selectedIntegration);
    
    return (
      <Dialog open={open && showConfigForm} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) setShowConfigForm(false);
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configure {selectedIntegration}</DialogTitle>
            <DialogDescription>
              Enter your API details for {selectedIntegration}
            </DialogDescription>
          </DialogHeader>
          
          <APIConfigForm 
            integrationId={selectedIntegration}
            fields={fields}
            initialValues={initialValues}
            onSave={handleSaveAPIConfig}
            onCancel={() => {
              setOpen(false);
              setShowConfigForm(false);
            }}
            testConnection={handleTestConnection}
          />
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-2 rounded-full">{icon}</div>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {integrations ? (
          <IntegrationList 
            integrations={integrations}
            isConnected={isConnected}
            onConfigure={handleOpenConfigForm}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        ) : isApiKey ? (
          <ApiKeyContent 
            title={title}
            onConfigureClick={handleOpenApiKeyDialog}
          />
        ) : isWebhook ? (
          <WebhookContent 
            onConfigureClick={handleOpenWebhookDialog}
          />
        ) : isWebhookEndpoint ? (
          <WebhookEndpointContent 
            onViewEndpointClick={handleOpenWebhookEndpointDialog}
          />
        ) : customActions ? (
          customActions
        ) : null}

        {/* Render Dialogs */}
        {renderConfigFormDialog()}
        
        {isApiKey && (
          <ApiKeyDialog
            open={open && !showConfigForm}
            setOpen={setOpen}
            selectedIntegration={selectedIntegration}
            apiKey={apiKey}
            setApiKey={setApiKey}
            handleSaveApiKey={handleSaveApiKey}
          />
        )}
        
        {isWebhook && (
          <WebhookDialog
            open={open && !showConfigForm}
            setOpen={setOpen}
            selectedIntegration={selectedIntegration}
            webhookUrl={webhookUrl}
            setWebhookUrl={setWebhookUrl}
            handleSaveWebhook={handleSaveWebhook}
            handleTestWebhook={handleTestWebhook}
          />
        )}
        
        {isWebhookEndpoint && (
          <WebhookEndpointDialog
            open={open && !showConfigForm}
            setOpen={setOpen}
          />
        )}
      </CardContent>
      
      {!integrations && !isApiKey && !isWebhook && !isWebhookEndpoint && !customActions && (
        <CardFooter className="pt-0">
          <Button variant="outline" size="sm" className="w-full">
            Learn More
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default IntegrationCard;
