
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Upload, Download } from "lucide-react";

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
        <Button variant="outline" className="flex items-center gap-1" onClick={onImportFromMaster}>
          <Upload size={16} />
          <span className="hidden md:inline">Import from Master</span>
        </Button>
      )}
      <Button variant="outline" className="flex items-center gap-1" onClick={onExportToCSV}>
        <Download size={16} />
        <span className="hidden md:inline">Export</span>
      </Button>
      <Button className="flex items-center gap-1" onClick={onAddAccount}>
        <PlusCircle size={16} />
        <span>Add Account</span>
      </Button>
    </div>
  );
};

export default GlAccountsActions;
