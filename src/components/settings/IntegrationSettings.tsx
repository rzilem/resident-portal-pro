
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Wallet, 
  CreditCard, 
  Building, 
  Link, 
  Zap,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const IntegrationSettings = () => {
  const [activeTab, setActiveTab] = useState("communications");
  
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>
            Connect your HOA management system with external services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
              <TabsTrigger value="communications">Communications</TabsTrigger>
              <TabsTrigger value="financials">Financial</TabsTrigger>
              <TabsTrigger value="management">Management</TabsTrigger>
              <TabsTrigger value="automation">Automation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="communications">
              <ScrollArea className="h-[600px] pr-4">
                <div className="grid gap-6">
                  {/* Email Service Integration */}
                  <IntegrationCard 
                    title="Email Service"
                    description="Connect your email provider to send notifications, updates, and statements"
                    icon={<Mail className="h-5 w-5" />}
                    integrations={[
                      { name: "Mailchimp", connected: true },
                      { name: "SendGrid", connected: false },
                      { name: "Amazon SES", connected: false },
                      { name: "Custom SMTP", connected: false }
                    ]}
                  />
                  
                  {/* SMS Service Integration */}
                  <IntegrationCard 
                    title="SMS Service"
                    description="Connect your SMS provider to send text message notifications"
                    icon={<MessageSquare className="h-5 w-5" />}
                    integrations={[
                      { name: "Twilio", connected: false },
                      { name: "Plivo", connected: false },
                      { name: "Nexmo", connected: false }
                    ]}
                  />
                  
                  {/* Phone Service Integration */}
                  <IntegrationCard 
                    title="Phone Service"
                    description="Connect your phone system for calls and voicemail"
                    icon={<Phone className="h-5 w-5" />}
                    integrations={[
                      { name: "Twilio Voice", connected: false },
                      { name: "RingCentral", connected: false },
                      { name: "Vonage", connected: false },
                      { name: "Microsoft Teams Phone", connected: false }
                    ]}
                  />
                  
                  {/* Microsoft Teams Phone Integration */}
                  <IntegrationCard 
                    title="Microsoft Teams Phone"
                    description="Connect Microsoft Teams Phone for unified communications and calling capabilities"
                    icon={<Phone className="h-5 w-5" />}
                    integrations={[
                      { name: "Teams Direct Routing", connected: false },
                      { name: "Teams Calling Plan", connected: false },
                      { name: "Teams Operator Connect", connected: false }
                    ]}
                  />
                  
                  {/* Calendar Integration */}
                  <IntegrationCard 
                    title="Calendar"
                    description="Sync HOA events with external calendars"
                    icon={<Calendar className="h-5 w-5" />}
                    integrations={[
                      { name: "Google Calendar", connected: true },
                      { name: "Outlook Calendar", connected: false },
                      { name: "Apple Calendar", connected: false }
                    ]}
                  />
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="financials">
              <ScrollArea className="h-[600px] pr-4">
                <div className="grid gap-6">
                  {/* Payment Processing */}
                  <IntegrationCard 
                    title="Payment Processing"
                    description="Connect payment processors to handle HOA dues and fees"
                    icon={<CreditCard className="h-5 w-5" />}
                    integrations={[
                      { name: "Stripe", connected: true },
                      { name: "PayPal", connected: false },
                      { name: "Square", connected: false },
                      { name: "Authorize.net", connected: false }
                    ]}
                  />
                  
                  {/* Banking Integration */}
                  <IntegrationCard 
                    title="Banking"
                    description="Connect bank accounts for automated reconciliation"
                    icon={<Wallet className="h-5 w-5" />}
                    integrations={[
                      { name: "Plaid", connected: false },
                      { name: "Yodlee", connected: false },
                      { name: "Direct Bank API", connected: false }
                    ]}
                  />
                  
                  {/* Accounting Software */}
                  <IntegrationCard 
                    title="Accounting Software"
                    description="Connect your accounting software for seamless financial management"
                    icon={<FileText className="h-5 w-5" />}
                    integrations={[
                      { name: "QuickBooks", connected: false },
                      { name: "Xero", connected: false },
                      { name: "FreshBooks", connected: false },
                      { name: "Wave", connected: false }
                    ]}
                  />
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="management">
              <ScrollArea className="h-[600px] pr-4">
                <div className="grid gap-6">
                  {/* Property Management */}
                  <IntegrationCard 
                    title="Property Management"
                    description="Connect with property management systems"
                    icon={<Building className="h-5 w-5" />}
                    integrations={[
                      { name: "Buildium", connected: false },
                      { name: "AppFolio", connected: false },
                      { name: "Propertyware", connected: false },
                      { name: "Yardi", connected: false }
                    ]}
                  />
                  
                  {/* Microsoft Dynamics 365 */}
                  <IntegrationCard 
                    title="Microsoft Dynamics 365"
                    description="Connect with Microsoft Dynamics 365 for comprehensive business management"
                    icon={<Building className="h-5 w-5" />}
                    integrations={[
                      { name: "Dynamics 365 Business Central", connected: false },
                      { name: "Dynamics 365 Finance", connected: false },
                      { name: "Dynamics 365 Customer Service", connected: false },
                      { name: "Dynamics 365 Field Service", connected: false }
                    ]}
                  />
                  
                  {/* Document Management */}
                  <IntegrationCard 
                    title="Document Management"
                    description="Connect document storage services"
                    icon={<FileText className="h-5 w-5" />}
                    integrations={[
                      { name: "Google Drive", connected: true },
                      { name: "Dropbox", connected: false },
                      { name: "OneDrive", connected: false },
                      { name: "Box", connected: false }
                    ]}
                  />
                  
                  {/* Maintenance Management */}
                  <IntegrationCard 
                    title="Maintenance & Work Orders"
                    description="Connect maintenance management systems"
                    icon={<Building className="h-5 w-5" />}
                    integrations={[
                      { name: "BuildingLink", connected: false },
                      { name: "FixxFlo", connected: false },
                      { name: "Breezeway", connected: false }
                    ]}
                  />
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="automation">
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

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
}

const IntegrationCard = ({ 
  title, 
  description, 
  icon, 
  integrations,
  isWebhook,
  isApiKey,
  isWebhookEndpoint
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
      </CardContent>
    </Card>
  );
};

export default IntegrationSettings;
