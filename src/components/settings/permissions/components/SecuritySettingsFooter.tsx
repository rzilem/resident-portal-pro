
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface SecuritySettingsFooterProps {
  hasChanges: boolean;
  isSaving: boolean;
  onReset: () => void;
  onSave: () => void;
}

const SecuritySettingsFooter: React.FC<SecuritySettingsFooterProps> = ({
  hasChanges,
  isSaving,
  onReset,
  onSave
}) => {
  return (
    <div className="flex justify-end gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              onClick={onReset}
              disabled={!hasChanges || isSaving}
            >
              Reset Changes
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Discard all changes</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={onSave}
              disabled={!hasChanges || isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Security Settings</span>
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save all security changes</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SecuritySettingsFooter;
