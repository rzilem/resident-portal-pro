
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Loader2 } from 'lucide-react';
import { useXAI } from '@/hooks/use-xai';
import { X_AI_MODELS } from '@/utils/xai';
import { toast } from 'sonner';

interface XAIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const XAIDialog: React.FC<XAIDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { settings, saveXAISettings, testXAIConnection, isLoading } = useXAI();
  
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [defaultModel, setDefaultModel] = useState(settings.defaultModel);
  const [organization, setOrganization] = useState(settings.organization);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (open) {
      setApiKey(settings.apiKey);
      setDefaultModel(settings.defaultModel);
      setOrganization(settings.organization);
    }
  }, [open, settings]);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast.error('API key is required');
      return;
    }
    
    const success = await saveXAISettings({
      apiKey,
      defaultModel,
      organization
    });
    
    if (success) {
      onOpenChange(false);
    }
  };

  const handleTest = async () => {
    if (!apiKey.trim()) {
      toast.error('API key is required');
      return;
    }
    
    setIsTesting(true);
    const success = await testXAIConnection(apiKey);
    setIsTesting(false);
    
    if (success) {
      toast.success('X.AI API connection test successful');
    } else {
      toast.error('X.AI API connection test failed');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            X.AI Integration
          </DialogTitle>
          <DialogDescription>
            Configure your X.AI API for AI-powered text generation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your X.AI API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Find your API key in the X.AI dashboard under Developer settings
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization">Organization ID (Optional)</Label>
            <Input
              id="organization"
              type="text"
              placeholder="Enter your organization ID"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="default-model">Default Model</Label>
            <Select 
              value={defaultModel}
              onValueChange={setDefaultModel}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a default model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={X_AI_MODELS.GROK_1}>Grok-1 (Text)</SelectItem>
                <SelectItem value={X_AI_MODELS.GROK_VISION}>Grok Vision (Image & Text)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Grok-1 is for text generation, while Grok Vision can process both images and text
            </p>
          </div>
        </div>

        <div className="flex justify-between space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading || isTesting}
          >
            Cancel
          </Button>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleTest}
              disabled={!apiKey || isLoading || isTesting}
            >
              {isTesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing
                </>
              ) : (
                'Test Connection'
              )}
            </Button>
            
            <Button 
              onClick={handleSave}
              disabled={!apiKey || isLoading || isTesting}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving
                </>
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default XAIDialog;
