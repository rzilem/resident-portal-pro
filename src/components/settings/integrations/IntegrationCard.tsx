
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Copy, Check, Link } from "lucide-react";
import { toast } from "sonner";
import { useIntegrations } from '@/hooks/use-integrations';
import APIConfigForm, { APIConfigFormProps } from './APIConfigForm';

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
  const [copied, setCopied] = useState(false);
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

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText('sk_test_example_api_key_for_demo');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIntegrationConfig = (name: string) => {
    const integration = getIntegration(name);
    if (!integration) return {};
    
    // Filter out non-user-configurable fields and convert to appropriate format
    const {enabled, lastSync, ...config} = integration;
    return config;
  };

  const renderAPIConfigForm = () => {
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

  const renderApiKeyDialog = () => (
    <Dialog open={open && !showConfigForm} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure API Key</DialogTitle>
          <DialogDescription>
            Enter your API key for {selectedIntegration}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input 
              id="apiKey" 
              placeholder="Enter your API key" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              This key will be stored securely and used to authenticate with the service.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveApiKey}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const renderWebhookDialog = () => (
    <Dialog open={open && !showConfigForm} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure Webhook</DialogTitle>
          <DialogDescription>
            Enter your webhook URL for {selectedIntegration}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input 
              id="webhookUrl" 
              placeholder="https://hooks.zapier.com/..." 
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              This URL will receive webhook events from our system.
            </p>
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleTestWebhook}
            disabled={!webhookUrl}
          >
            Test Webhook
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveWebhook}>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const renderWebhookEndpointDialog = () => (
    <Dialog open={open && !showConfigForm} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Webhook Endpoint</DialogTitle>
          <DialogDescription>
            Use this URL to send data to your system
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="endpointUrl">Your Webhook URL</Label>
            <div className="flex items-center space-x-2">
              <Input 
                id="endpointUrl" 
                readOnly 
                value="https://api.yourdomain.com/webhook/incoming" 
              />
              <Button 
                size="icon" 
                variant="outline" 
                onClick={handleCopyApiKey}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="pt-4">
              <div className="rounded-md bg-muted p-4">
                <div className="text-sm font-medium">Example webhook payload:</div>
                <pre className="mt-2 text-xs text-muted-foreground overflow-auto">
                  {JSON.stringify({
                    event: "new_document",
                    timestamp: new Date().toISOString(),
                    data: {
                      id: "doc-123",
                      name: "Example Document",
                      type: "pdf"
                    }
                  }, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

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
          <ul className="space-y-3">
            {integrations.map((integration, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>{integration.name}</span>
                <div className="flex items-center gap-2">
                  {isConnected(integration.name) && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedIntegration(integration.name);
                        setShowConfigForm(true);
                        setOpen(true);
                      }}
                    >
                      Configure
                    </Button>
                  )}
                  <Switch 
                    checked={integration.connected || isConnected(integration.name)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleConnect(integration.name);
                      } else {
                        handleDisconnect(integration.name);
                      }
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : isApiKey ? (
          <div className="flex items-center justify-between">
            <span>API Key Configuration</span>
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedIntegration(title);
                setOpen(true);
              }}
            >
              Configure API Key
            </Button>
          </div>
        ) : isWebhook ? (
          <div className="flex items-center justify-between">
            <span>Webhook Configuration</span>
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedIntegration(title);
                setOpen(true);
              }}
            >
              Configure Webhook
            </Button>
          </div>
        ) : isWebhookEndpoint ? (
          <div className="flex items-center justify-between">
            <span>Webhook Endpoint for External Services</span>
            <Button 
              variant="outline"
              onClick={() => {
                setSelectedIntegration(title);
                setOpen(true);
              }}
            >
              <Link className="h-4 w-4 mr-2" />
              View Endpoint
            </Button>
          </div>
        ) : customActions ? (
          customActions
        ) : null}

        {renderAPIConfigForm()}
        {isApiKey && renderApiKeyDialog()}
        {isWebhook && renderWebhookDialog()}
        {isWebhookEndpoint && renderWebhookEndpointDialog()}
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
