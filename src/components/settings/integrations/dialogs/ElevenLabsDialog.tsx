
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2, Loader2, AlertTriangle } from 'lucide-react';
import { useElevenLabs } from '@/hooks/use-elevenlabs';
import { VOICE_OPTIONS } from '@/utils/elevenlabs';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ElevenLabsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ElevenLabsDialog: React.FC<ElevenLabsDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { settings, saveElevenLabsSettings, testElevenLabsAPI, isLoading, isAuthenticated } = useElevenLabs();
  
  // Initialize state from settings on mount and when settings change
  const [apiKey, setApiKey] = useState('');
  const [defaultVoiceId, setDefaultVoiceId] = useState('');
  const [defaultModel, setDefaultModel] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  // Update local state when dialog opens or settings change
  useEffect(() => {
    if (open) {
      console.log('Dialog opened, initializing with settings:', {
        apiKey: settings.apiKey ? `${settings.apiKey.substring(0, 5)}...` : 'none',
        defaultVoiceId: settings.defaultVoiceId,
        defaultModel: settings.defaultModel
      });
      setApiKey(settings.apiKey);
      setDefaultVoiceId(settings.defaultVoiceId);
      setDefaultModel(settings.defaultModel);
    }
  }, [open, settings]);

  useEffect(() => {
    console.log('ElevenLabs Dialog State:', {
      openStatus: open,
      currentSettings: settings,
      localApiKey: apiKey ? `${apiKey.substring(0, 5)}...` : 'none',
      localDefaultVoiceId: defaultVoiceId,
      localDefaultModel: defaultModel
    });
  }, [open, settings, apiKey, defaultVoiceId, defaultModel]);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast.error('API key is required');
      return;
    }
    
    console.log('Attempting to save ElevenLabs settings:', {
      apiKey: apiKey ? `${apiKey.substring(0, 5)}...` : 'empty',
      defaultVoiceId,
      defaultModel
    });
    
    const success = await saveElevenLabsSettings({
      apiKey,
      defaultVoiceId,
      defaultModel
    });
    
    if (success) {
      toast.success('ElevenLabs settings saved successfully');
      onOpenChange(false);
    } else {
      toast.error('Failed to save ElevenLabs settings');
    }
  };

  const handleTest = async () => {
    if (!apiKey.trim()) {
      toast.error('API key is required');
      return;
    }
    
    setIsTesting(true);
    try {
      console.log('Testing ElevenLabs API...');
      const success = await testElevenLabsAPI(apiKey);
      
      if (success) {
        toast.success('ElevenLabs API connection test successful');
      } else {
        toast.error('ElevenLabs API connection test failed');
      }
    } catch (error) {
      console.error('Error during ElevenLabs API test:', error);
      toast.error('ElevenLabs API test encountered an error');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            ElevenLabs Integration
          </DialogTitle>
          <DialogDescription>
            Configure your ElevenLabs API for high-quality voice synthesis
          </DialogDescription>
        </DialogHeader>

        {!isAuthenticated && (
          <Alert variant="default" className="mb-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20">
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <AlertDescription className="text-yellow-600 dark:text-yellow-400">
              You need to be logged in to save settings permanently. Settings will be saved in local storage for now.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your ElevenLabs API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Find your API key in the ElevenLabs dashboard under Profile &gt; API Key
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="default-voice">Default Voice</Label>
            <Select 
              value={defaultVoiceId}
              onValueChange={setDefaultVoiceId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a default voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={VOICE_OPTIONS.ARIA}>Aria (Female, Professional)</SelectItem>
                <SelectItem value={VOICE_OPTIONS.ROGER}>Roger (Male, Authoritative)</SelectItem>
                <SelectItem value={VOICE_OPTIONS.SARAH}>Sarah (Female, Friendly)</SelectItem>
                <SelectItem value={VOICE_OPTIONS.DANIEL}>Daniel (Male, Conversational)</SelectItem>
              </SelectContent>
            </Select>
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
                <SelectItem value="eleven_turbo_v2">Eleven Turbo v2 (Faster)</SelectItem>
                <SelectItem value="eleven_multilingual_v2">Eleven Multilingual v2 (Higher Quality)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Turbo is faster and cheaper, while Multilingual offers higher quality
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

export default ElevenLabsDialog;
