
import React, { useState } from 'react';
import { Copy, Share2, Check, Edit, Mail, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { OnboardingProject } from '@/types/onboarding';

interface ClientSharingInfoProps {
  project: OnboardingProject;
  shareableLink: string;
}

const ClientSharingInfo: React.FC<ClientSharingInfoProps> = ({
  project,
  shareableLink
}) => {
  const [copied, setCopied] = useState(false);
  const [emailContent, setEmailContent] = useState(
    `Hello,\n\nWe've created an onboarding portal for ${project.associationName} where you can track the progress of your onboarding with our management company.\n\nYou can access your onboarding dashboard at: ${shareableLink}\n\nPlease let us know if you have any questions.\n\nThank you,\n[Your Name]\n[Your Company]`
  );
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    toast.success('Link copied to clipboard');
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };
  
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Share with Client</CardTitle>
          <CardDescription>
            Share this link with your client to give them access to the onboarding dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input 
                value={shareableLink}
                readOnly
                className="font-mono text-sm"
              />
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Link expires 90 days after project completion
              </span>
              
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Regenerate Link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Email Template</CardTitle>
          <CardDescription>
            Use this template to notify your client about the onboarding portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            className="min-h-[200px]"
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Template
          </Button>
          <Button size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClientSharingInfo;
