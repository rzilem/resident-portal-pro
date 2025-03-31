
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface ElevenLabsActionsProps {
  onCancel: () => void;
  onTest: () => void;
  onSave: () => void;
  isLoading: boolean;
  isTesting: boolean;
  apiKey: string;
}

const ElevenLabsActions: React.FC<ElevenLabsActionsProps> = ({
  onCancel,
  onTest,
  onSave,
  isLoading,
  isTesting,
  apiKey
}) => {
  return (
    <div className="flex justify-between space-x-2">
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
      
      <div className="flex space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={onTest}
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
            </TooltipTrigger>
            <TooltipContent>
              <p>Test API connection</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={onSave}
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
            </TooltipTrigger>
            <TooltipContent>
              <p>Save API configuration</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ElevenLabsActions;
