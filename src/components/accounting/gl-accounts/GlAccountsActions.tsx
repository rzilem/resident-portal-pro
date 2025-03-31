
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Upload, Download } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface GlAccountsActionsProps {
  isMaster: boolean;
  onAddAccount: () => void;
  onImportFromMaster: () => void;
  onExportToCSV: () => void;
}

const GlAccountsActions: React.FC<GlAccountsActionsProps> = ({
  isMaster,
  onAddAccount,
  onImportFromMaster,
  onExportToCSV
}) => {
  return (
    <div className="flex gap-2">
      {!isMaster && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1" onClick={onImportFromMaster}>
                <Upload size={16} />
                <span className="hidden md:inline">Import from Master</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Import accounts from master list</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1" onClick={onExportToCSV}>
              <Download size={16} />
              <span className="hidden md:inline">Export</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export accounts to CSV</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="flex items-center gap-1" onClick={onAddAccount}>
              <PlusCircle size={16} />
              <span>Add Account</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create a new GL account</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default GlAccountsActions;
