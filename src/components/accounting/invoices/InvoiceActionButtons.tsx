
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const InvoiceActionButtons = () => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild variant="default" size="sm" className="gap-1">
        <Link to="/accounting/invoice-coding">
          <Plus className="h-4 w-4" />
          Code New Invoice
        </Link>
      </Button>
      <Button variant="outline" size="sm" className="gap-1">
        <FileText className="h-4 w-4" />
        Export
      </Button>
      <Button variant="outline" size="sm" className="gap-1">
        <Download className="h-4 w-4" />
        Download
      </Button>
    </div>
  );
};

export default InvoiceActionButtons;
