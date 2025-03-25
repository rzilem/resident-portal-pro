
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Copy, Check, Link } from "lucide-react";
import { toast } from "sonner";
import { useIntegrations } from '@/hooks/use-integrations';

interface Integration {
  name: string;
  connected: boolean;
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
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  title,
  description,
  icon,
  integrations,
  isApiKey,
  isWebhook,
  isWebhookEndpoint,
  customActions
}) => {
  const [open, setOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [copied, setCopied] = useState(false);
  
  const { 
    connectIntegration, 
    disconnectIntegration, 
    updateIntegrationSettings, 
    testWebhook,
    isConnected 
  } = useIntegrations();

  const handleConnect = async (name: string) => {
    try {
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

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText('sk_test_example_api_key_for_demo');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderApiKeyDialog = () => (
    <Dialog open={open} onOpenChange={setOpen}>
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
    <Dialog open={open} onOpenChange={setOpen}>
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
    <Dialog open={open} onOpenChange={setOpen}>
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
                <div>
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
