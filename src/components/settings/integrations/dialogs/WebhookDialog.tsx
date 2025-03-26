
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WebhookDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedIntegration: string | null;
  webhookUrl: string;
  setWebhookUrl: (value: string) => void;
  handleSaveWebhook: () => Promise<void>;
  handleTestWebhook: () => Promise<void>;
}

const WebhookDialog: React.FC<WebhookDialogProps> = ({
  open,
  setOpen,
  selectedIntegration,
  webhookUrl,
  setWebhookUrl,
  handleSaveWebhook,
  handleTestWebhook
}) => {
  return (
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
};

export default WebhookDialog;
