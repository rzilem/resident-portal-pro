
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            <TooltipContent>
              <p>Test API connection</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading || isTesting}
                >
                  Cancel
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cancel changes</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
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
              </TooltipTrigger>
              <TooltipContent>
                <p>Save API configuration</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default XAIActions;
