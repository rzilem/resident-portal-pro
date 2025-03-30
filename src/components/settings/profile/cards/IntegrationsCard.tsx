
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useIntegrations } from '@/hooks/use-integrations';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const IntegrationsCard = () => {
  const { integrations, isLoading, connectIntegration, disconnectIntegration, isConnected } = useIntegrations();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleToggle = async (name: string, checked: boolean) => {
    try {
      if (checked) {
        await connectIntegration(name, { enabled: true });
      } else {
        await disconnectIntegration(name);
      }
    } catch (error) {
      console.error('Error toggling integration:', error);
      toast({
        title: 'Error',
        description: `Failed to ${checked ? 'connect' : 'disconnect'} ${name}`,
        variant: 'destructive',
      });
    }
  };
  
  const handleNavigateToSettings = () => {
    navigate('/integrations');
  };
  
  const getStatusIcon = (name: string) => {
    if (isConnected(name)) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <Clock className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
        <CardDescription>Manage your connected accounts and services.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="py-2 text-sm text-muted-foreground">Loading integrations...</div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <Label htmlFor="google-integration" className="flex flex-col space-y-1">
                <div className="flex items-center gap-2">
                  <span>Google</span>
                  {getStatusIcon('Google')}
                </div>
                <span className="text-xs text-muted-foreground">Connect your Google account</span>
              </Label>
              <Switch 
                id="google-integration" 
                checked={isConnected('Google')}
                onCheckedChange={(checked) => handleToggle('Google', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="slack-integration" className="flex flex-col space-y-1">
                <div className="flex items-center gap-2">
                  <span>Slack</span>
                  {getStatusIcon('Slack')}
                </div>
                <span className="text-xs text-muted-foreground">Connect with your workspace</span>
              </Label>
              <Switch 
                id="slack-integration"
                checked={isConnected('Slack')}
                onCheckedChange={(checked) => handleToggle('Slack', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="github-integration" className="flex flex-col space-y-1">
                <div className="flex items-center gap-2">
                  <span>GitHub</span>
                  {getStatusIcon('GitHub')}
                </div>
                <span className="text-xs text-muted-foreground">Connect to your repositories</span>
              </Label>
              <Switch 
                id="github-integration"
                checked={isConnected('GitHub')}
                onCheckedChange={(checked) => handleToggle('GitHub', checked)}
              />
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2 flex items-center gap-2"
              onClick={handleNavigateToSettings}
            >
              <span>Manage all integrations</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default IntegrationsCard;
