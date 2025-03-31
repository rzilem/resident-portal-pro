
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Save, X, FileDown } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface TemplateToolbarProps {
  onSave: () => void;
  onCancel: () => void;
  onExport: () => void;
}

const TemplateToolbar: React.FC<TemplateToolbarProps> = ({ 
  onSave, 
  onCancel,
  onExport
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-2 mt-2 mb-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="default" className="gap-1.5">
              <PlusCircle className="h-4 w-4" />
              New Template
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create a new template</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onExport} className="gap-1.5">
                <FileDown className="h-4 w-4" />
                Export
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export templates</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onCancel} className="gap-1.5">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Discard changes</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="default" size="sm" onClick={onSave} className="gap-1.5">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save template changes</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default TemplateToolbar;
