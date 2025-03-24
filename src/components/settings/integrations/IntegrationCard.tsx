import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

interface IntegrationProvider {
  name: string;
  connected: boolean;
}

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  integrations?: IntegrationProvider[];
  isWebhook?: boolean;
  isApiKey?: boolean;
  isWebhookEndpoint?: boolean;
  customActions?: React.ReactNode;
}

const IntegrationCard = ({ 
  title, 
  description, 
  icon, 
  integrations,
  isWebhook,
  isApiKey,
  isWebhookEndpoint,
  customActions
}: IntegrationCardProps) => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [endpointName, setEndpointName] = useState("");
  const [webhookEndpoints, setWebhookEndpoints] = useState([
    { name: "New Resident Notification", url: "https://api.residentpro.com/webhooks/new-resident", active: true },
    { name: "Payment Received", url: "https://api.residentpro.com/webhooks/payment", active: true }
  ]);

  const handleConnect = (provider: string) => {
    toast.success(`Connected to ${provider}`);
  };

  const handleDisconnect = (provider: string) => {
    toast.success(`Disconnected from ${provider}`);
  };

  const handleSaveWebhook = () => {
    if (!webhookUrl) {
      toast.error("Please enter a webhook URL");
      return;
    }
    
    toast.success("Webhook URL saved successfully");
  };

  const handleGenerateApiKey = () => {
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setApiKey("sk_res_" + Math.random().toString(36).substring(2, 15));
      setIsGenerating(false);
      toast.success("API key generated successfully");
    }, 1000);
  };

  const handleAddEndpoint = () => {
    if (!endpointName) {
      toast.error("Please enter an endpoint name");
      return;
    }
    
    const newEndpoint = {
      name: endpointName,
      url: `https://api.residentpro.com/webhooks/${endpointName.toLowerCase().replace(/\s+/g, '-')}`,
      active: true
    };
    
    setWebhookEndpoints([...webhookEndpoints, newEndpoint]);
    setEndpointName("");
    toast.success("Webhook endpoint created");
  };

  const toggleEndpoint = (index: number) => {
    const updatedEndpoints = [...webhookEndpoints];
    updatedEndpoints[index].active = !updatedEndpoints[index].active;
    setWebhookEndpoints(updatedEndpoints);
    
    toast.success(`Webhook ${updatedEndpoints[index].active ? 'activated' : 'deactivated'}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-primary/10 p-2">
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {integrations && (
          <div className="space-y-4">
            {integrations.map((integration) => (
              <div key={integration.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {integration.name}
                  {integration.connected && (
                    <Badge variant="outline" className="text-xs text-green-600 bg-green-50 border-green-200">
                      Connected
                    </Badge>
                  )}
                </div>
                <Button 
                  variant={integration.connected ? "destructive" : "default"} 
                  size="sm"
                  onClick={() => integration.connected ? 
                    handleDisconnect(integration.name) : 
                    handleConnect(integration.name)}
                >
                  {integration.connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {isWebhook && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhook">Zapier Webhook URL</Label>
              <div className="flex gap-2">
                <Input 
                  id="webhook" 
                  placeholder="https://hooks.zapier.com/..." 
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
                <Button onClick={handleSaveWebhook}>Save</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Enter your Zapier webhook URL to connect ResidentPro with your Zaps
              </p>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <h4 className="font-medium text-sm mb-2">Supported Triggers</h4>
              <ul className="text-sm space-y-1.5">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                  New resident added
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                  Payment received
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                  Maintenance request created
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                  Document uploaded
                </li>
              </ul>
            </div>
          </div>
        )}
        
        {isApiKey && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <div className="flex gap-2">
                <Input 
                  id="apiKey" 
                  placeholder="API key will appear here" 
                  value={apiKey}
                  readOnly
                />
                <Button onClick={handleGenerateApiKey} disabled={isGenerating}>
                  {isGenerating ? "Generating..." : "Generate"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Generate an API key to access the ResidentPro API programmatically
              </p>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <h4 className="font-medium text-sm mb-2">API Documentation</h4>
              <p className="text-sm">
                View our API documentation to learn how to integrate with ResidentPro
              </p>
              <Button variant="link" className="p-0 h-auto text-sm mt-1">
                View Documentation
              </Button>
            </div>
          </div>
        )}
        
        {isWebhookEndpoint && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="endpointName">New Webhook Endpoint</Label>
              <div className="flex gap-2">
                <Input 
                  id="endpointName" 
                  placeholder="Endpoint name" 
                  value={endpointName}
                  onChange={(e) => setEndpointName(e.target.value)}
                />
                <Button onClick={handleAddEndpoint}>Add</Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Active Endpoints</h4>
              {webhookEndpoints.map((endpoint, index) => (
                <div key={index} className="bg-muted p-3 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{endpoint.name}</span>
                    <Switch 
                      checked={endpoint.active} 
                      onCheckedChange={() => toggleEndpoint(index)} 
                    />
                  </div>
                  <code className="text-xs block bg-background p-2 rounded border">
                    {endpoint.url}
                  </code>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {customActions && (
          <div className="mt-4">{customActions}</div>
        )}
      </CardContent>
    </Card>
  );
};

export default IntegrationCard;
