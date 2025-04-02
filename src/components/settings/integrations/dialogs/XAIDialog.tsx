
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageSquare } from 'lucide-react';
import { useXAIDialog } from './xai/useXAIDialog';
import XAIFormFields from './xai/XAIFormFields';

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
    setApiKey,
    setDefaultModel,
    setOrganization,
    handleSave,
    handleTest
  } = useXAIDialog(open, onOpenChange);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Configure X.AI Integration
          </DialogTitle>
          <DialogDescription>
            Enter your X.AI API credentials to enable AI-powered features in the application.
          </DialogDescription>
        </DialogHeader>
        
        <XAIFormFields
          apiKey={apiKey}
          defaultModel={defaultModel}
          organization={organization}
          isTesting={isTesting}
          isLoading={isLoading}
          setApiKey={setApiKey}
          setDefaultModel={setDefaultModel}
          setOrganization={setOrganization}
          handleSave={handleSave}
          handleTest={handleTest}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default XAIDialog;
