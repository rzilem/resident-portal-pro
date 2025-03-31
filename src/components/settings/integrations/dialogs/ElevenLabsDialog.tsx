
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Volume2 } from 'lucide-react';
import ElevenLabsFormFields from './elevenlabs/ElevenLabsFormFields';
import ElevenLabsActions from './elevenlabs/ElevenLabsActions';
import AuthRequiredAlert from './elevenlabs/AuthRequiredAlert';
import { useElevenLabsDialog } from './elevenlabs/useElevenLabsDialog';

interface ElevenLabsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ElevenLabsDialog: React.FC<ElevenLabsDialogProps> = ({
  open,
  onOpenChange
}) => {
  const {
    apiKey,
    defaultVoiceId,
    defaultModel,
    isTesting,
    isLoading,
    isAuthenticated,
    setApiKey,
    setDefaultVoiceId,
    setDefaultModel,
    handleSave,
    handleTest
  } = useElevenLabsDialog(open, onOpenChange);

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

        <AuthRequiredAlert isAuthenticated={isAuthenticated} />

        <ElevenLabsFormFields
          apiKey={apiKey}
          defaultVoiceId={defaultVoiceId}
          defaultModel={defaultModel}
          onApiKeyChange={setApiKey}
          onVoiceChange={setDefaultVoiceId}
          onModelChange={setDefaultModel}
        />

        <ElevenLabsActions
          onCancel={() => onOpenChange(false)}
          onTest={handleTest}
          onSave={handleSave}
          isLoading={isLoading}
          isTesting={isTesting}
          apiKey={apiKey}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ElevenLabsDialog;
