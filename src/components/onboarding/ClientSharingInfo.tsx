
import React, { useState } from 'react';
import { Copy, Mail, Download, Check, Link } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TooltipButton } from '@/components/ui/tooltip-button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Project } from '@/types/onboarding';
import { useToast } from '@/hooks/use-toast';

interface ClientSharingInfoProps {
  project: Project;
}

const ClientSharingInfo: React.FC<ClientSharingInfoProps> = ({ project }) => {
  const { toast } = useToast();
  const [sharingEnabled, setSharingEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const shareableLink = `https://onboard.hoacompany.com/client/${project.id}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    toast({
      title: "Link Copied",
      description: "The shareable link has been copied to your clipboard"
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleEmailLink = () => {
    const subject = `Access your onboarding portal for ${project.associationName}`;
    const body = `Hello ${project.contactName},\n\nYou can access your association onboarding portal here: ${shareableLink}\n\nThank you,\nYour HOA Management Team`;
    
    window.open(`mailto:${project.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    
    toast({
      title: "Email Opened",
      description: "An email draft has been created with the link"
    });
  };
  
  const handleDownloadInfo = () => {
    toast({
      title: "Info Sheet Downloaded",
      description: "The onboarding information has been downloaded as a PDF"
    });
  };
  
  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Client Portal Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base font-medium">Enable Client Portal</h3>
              <p className="text-sm text-muted-foreground">
                Allow the client to access their onboarding information
              </p>
            </div>
            <Switch 
              checked={sharingEnabled} 
              onCheckedChange={setSharingEnabled} 
              id="portal-status"
            />
          </div>
          
          {sharingEnabled && (
            <>
              <div className="border-t pt-4">
                <Label htmlFor="share-link" className="mb-2 block">
                  Shareable Link
                </Label>
                <div className="flex gap-2">
                  <Input 
                    id="share-link"
                    value={shareableLink}
                    readOnly
                    className="flex-1"
                  />
                  <TooltipButton 
                    tooltipText={copied ? "Copied!" : "Copy link to clipboard"}
                    onClick={handleCopyLink}
                    size="sm"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </TooltipButton>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <TooltipButton 
                  tooltipText="Email portal link to client"
                  variant="outline" 
                  onClick={handleEmailLink}
                  className="gap-2 flex-1"
                >
                  <Mail className="h-4 w-4" />
                  Email Link
                </TooltipButton>
                
                <TooltipButton 
                  tooltipText="Download onboarding information as PDF"
                  variant="outline" 
                  onClick={handleDownloadInfo}
                  className="gap-2 flex-1"
                >
                  <Download className="h-4 w-4" />
                  Download Info Sheet
                </TooltipButton>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">What Clients Can See</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="show-timeline" defaultChecked />
                <Label htmlFor="show-timeline">Project Timeline</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="show-tasks" defaultChecked />
                <Label htmlFor="show-tasks">Onboarding Tasks</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="show-docs" defaultChecked />
                <Label htmlFor="show-docs">Required Documents</Label>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="show-messages" defaultChecked />
                <Label htmlFor="show-messages">Message Center</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="show-uploads" defaultChecked />
                <Label htmlFor="show-uploads">File Upload Area</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="show-contacts" defaultChecked />
                <Label htmlFor="show-contacts">Team Contact Info</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientSharingInfo;
