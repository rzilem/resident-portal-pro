
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const IntegrationsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
        <CardDescription>Manage your connected accounts and services.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="google-integration" className="flex flex-col space-y-1">
            <span>Google</span>
            <span className="text-xs text-muted-foreground">Connect your Google account</span>
          </Label>
          <Switch id="google-integration" />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="slack-integration" className="flex flex-col space-y-1">
            <span>Slack</span>
            <span className="text-xs text-muted-foreground">Connect with your workspace</span>
          </Label>
          <Switch id="slack-integration" />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="github-integration" className="flex flex-col space-y-1">
            <span>GitHub</span>
            <span className="text-xs text-muted-foreground">Connect to your repositories</span>
          </Label>
          <Switch id="github-integration" />
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationsCard;
