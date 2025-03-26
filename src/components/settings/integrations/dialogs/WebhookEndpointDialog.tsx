
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Copy } from "lucide-react";

interface WebhookEndpointDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const WebhookEndpointDialog: React.FC<WebhookEndpointDialogProps> = ({
  open,
  setOpen
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText('https://api.yourdomain.com/webhook/incoming');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
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
                onClick={handleCopyEndpoint}
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
};

export default WebhookEndpointDialog;
