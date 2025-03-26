
import React from 'react';
import { InvoiceColumn } from './InvoiceColumnsSelector';
import InvoiceTabs from './InvoiceTabs';
import InvoiceColumnsSelector from './InvoiceColumnsSelector';
import InvoiceActionButtons from './InvoiceActionButtons';

interface InvoiceQueueHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  columns: InvoiceColumn[];
  onColumnsChange: (columns: InvoiceColumn[]) => void;
}

const InvoiceQueueHeader: React.FC<InvoiceQueueHeaderProps> = ({
  activeTab,
  onTabChange,
  columns,
  onColumnsChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-4 items-start sm:items-center">
      <InvoiceTabs activeTab={activeTab} onTabChange={onTabChange} />
      <div className="flex items-center gap-2">
        <InvoiceColumnsSelector 
          columns={columns} 
          onChange={onColumnsChange} 
        />
        <InvoiceActionButtons />
      </div>
    </div>
  );
};

export default InvoiceQueueHeader;
