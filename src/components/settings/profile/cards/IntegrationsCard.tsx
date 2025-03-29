
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Globe, Smartphone, MessageSquare } from 'lucide-react';

const IntegrationsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
        <CardDescription>Connect to third-party services</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="font-medium">Website</div>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Connected</Badge>
            </div>
            <div className="text-sm text-muted-foreground mt-1">Connect your personal website</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <Smartphone className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="font-medium">Mobile App</div>
              <Switch id="mobile-app" />
            </div>
            <div className="text-sm text-muted-foreground mt-1">Sync with mobile application</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="font-medium">SMS Notifications</div>
              <Switch id="sms-integration" />
            </div>
            <div className="text-sm text-muted-foreground mt-1">Receive alerts via SMS</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationsCard;
