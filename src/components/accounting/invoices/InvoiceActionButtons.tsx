
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  RefreshCw, 
  Download, 
  PlusCircle
} from "lucide-react";

const InvoiceActionButtons: React.FC = () => {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" className="flex items-center gap-1">
        <RefreshCw size={16} /> Refresh
      </Button>
      <Button variant="outline" size="sm" className="flex items-center gap-1">
        <Download size={16} /> Export
      </Button>
      <Button size="sm" className="flex items-center gap-1">
        <PlusCircle size={16} /> New Invoice
      </Button>
    </div>
  );
};

export default InvoiceActionButtons;
