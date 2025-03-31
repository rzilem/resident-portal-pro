
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageSquare } from 'lucide-react';
import { useXAIDialog } from './xai/useXAIDialog';
import XAIFormFields from './xai/XAIFormFields';
import XAIActions from './xai/XAIActions';
import AuthRequiredAlert from './elevenlabs/AuthRequiredAlert';

interface XAIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const XAIDialog: React.FC<XAIDialogProps> = ({
  open,
  onOpenChange
}) => {
  const {
    apiKey,
    defaultModel,
    organization,
    isTesting,
    isLoading,
    isAuthenticated,
    setApiKey,
    setDefaultModel,
    setOrganization,
    handleSave,
    handleTest
  } = useXAIDialog(open, onOpenChange);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            X.AI Integration
          </DialogTitle>
          <DialogDescription>
            Configure your X.AI (formerly OpenAI) API for AI-powered features
          </DialogDescription>
        </DialogHeader>

        <AuthRequiredAlert isAuthenticated={isAuthenticated} />

        <XAIFormFields
          apiKey={apiKey}
          defaultModel={defaultModel}
          organization={organization}
          onApiKeyChange={setApiKey}
          onModelChange={setDefaultModel}
          onOrganizationChange={setOrganization}
        />

        <XAIActions
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

export default XAIDialog;
