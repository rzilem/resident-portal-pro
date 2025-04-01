
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Upload, Download } from "lucide-react";
import { TooltipButton } from '@/components/ui/tooltip-button';

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
        <TooltipButton
          variant="outline"
          className="flex items-center gap-1"
          onClick={onImportFromMaster}
          tooltipText="Import accounts from master list"
        >
          <Upload size={16} />
          <span className="hidden md:inline">Import from Master</span>
        </TooltipButton>
      )}
      
      <TooltipButton
        variant="outline"
        className="flex items-center gap-1"
        onClick={onExportToCSV}
        tooltipText="Export accounts to CSV"
      >
        <Download size={16} />
        <span className="hidden md:inline">Export</span>
      </TooltipButton>
      
      <TooltipButton
        className="flex items-center gap-1"
        onClick={onAddAccount}
        tooltipText="Create a new GL account"
      >
        <PlusCircle size={16} />
        <span>Add Account</span>
      </TooltipButton>
    </div>
  );
};

export default GlAccountsActions;
