
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Volume2, Info } from 'lucide-react';
import ElevenLabsFormFields from './elevenlabs/ElevenLabsFormFields';
import ElevenLabsActions from './elevenlabs/ElevenLabsActions';
import AuthRequiredAlert from './elevenlabs/AuthRequiredAlert';
import { useElevenLabsDialog } from './elevenlabs/useElevenLabsDialog';
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    testLog,
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

        {testLog.length > 0 && (
          <Alert variant="outline" className="my-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <details>
                <summary className="cursor-pointer font-medium">Test Log (click to expand)</summary>
                <div className="mt-2 text-xs font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-h-40">
                  {testLog.map((log, index) => (
                    <div key={index}>{log}</div>
                  ))}
                </div>
              </details>
            </AlertDescription>
          </Alert>
        )}

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
