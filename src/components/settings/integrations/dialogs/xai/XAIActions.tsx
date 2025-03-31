
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface XAIActionsProps {
  onCancel: () => void;
  onTest: () => void;
  onSave: () => void;
  isLoading: boolean;
  isTesting: boolean;
  apiKey: string;
}

const XAIActions: React.FC<XAIActionsProps> = ({
  onCancel,
  onTest,
  onSave,
  isLoading,
  isTesting,
  apiKey
}) => {
  const hasApiKey = !!apiKey.trim();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onTest}
          disabled={isTesting || isLoading || !hasApiKey}
          className="flex items-center gap-2"
        >
          {isTesting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            'Test Connection'
          )}
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading || isTesting}
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={isLoading || isTesting || !hasApiKey}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default XAIActions;
