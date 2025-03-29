
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import { useSettings } from '@/hooks/use-settings';
import { useInvoiceQueue } from '@/hooks/use-invoice-queue';
import InvoiceFilters from './invoices/InvoiceFilters';
import InvoiceQueueHeader from './invoices/InvoiceQueueHeader';
import InvoiceQueueContent from './invoices/InvoiceQueueContent';
import { InvoiceColumn } from './invoices/InvoiceColumnsSelector';
import { InvoiceFilterState } from '@/components/settings/financial/payment-methods/types';

interface InvoiceQueueProps {
  className?: string;
  associationId?: string;
}

const InvoiceQueue: React.FC<InvoiceQueueProps> = ({ className, associationId }) => {
  const { preferences, updatePreference } = useSettings();
  
  // Define default columns
  const defaultColumns: InvoiceColumn[] = [
    { id: 'invoiceNumber', label: 'Invoice #', checked: true },
    { id: 'date', label: 'Date', checked: true },
    { id: 'dueDate', label: 'Due Date', checked: true },
    { id: 'vendor', label: 'Vendor', checked: true },
    { id: 'association', label: 'Association', checked: true },
    { id: 'amount', label: 'Amount', checked: true },
    { id: 'status', label: 'Status', checked: true },
    { id: 'recipient', label: 'Recipient', checked: false },
    { id: 'category', label: 'Category', checked: false },
    { id: 'createdAt', label: 'Created', checked: false }
  ];
  
  // Load columns from user preferences or use defaults
  const [columns, setColumns] = useState<InvoiceColumn[]>(
    preferences?.invoiceTableColumns || defaultColumns
  );
  
  // Use our custom hook for invoice data and state management
  const {
    activeTab,
    setActiveTab,
    loading,
    error,
    filters,
    setFilters,
    filteredInvoices,
    handleInvoiceAction
  } = useInvoiceQueue(associationId);
  
  const handleColumnsChange = (updatedColumns: InvoiceColumn[]) => {
    setColumns(updatedColumns);
    updatePreference('invoiceTableColumns', updatedColumns);
    toast("Column preferences saved", {
      description: "Your invoice table column preferences have been updated."
    });
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Association Payment Queue
        </CardTitle>
        <CardDescription>
          Manage and process vendor payments on behalf of associations
          {associationId && <span className="ml-1">for the selected association</span>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
          <InvoiceQueueHeader 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            columns={columns}
            onColumnsChange={handleColumnsChange}
          />
          
          <InvoiceFilters 
            filters={filters} 
            onFilterChange={setFilters} 
          />
          
          <InvoiceQueueContent 
            activeTab={activeTab}
            error={error}
            filteredInvoices={filteredInvoices}
            columns={columns}
            onAction={handleInvoiceAction}
            loading={loading}
          />
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InvoiceQueue;
