
import React from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AlertTriangle } from "lucide-react";
import InvoiceTabContent from './InvoiceTabContent';
import { InvoiceColumn } from './InvoiceColumnsSelector';
import { Invoice } from '@/components/settings/associations/types';

interface InvoiceQueueContentProps {
  activeTab: string;
  error: string | null;
  filteredInvoices: Invoice[];
  columns: InvoiceColumn[];
  onAction: (action: string, invoiceId: string) => void;
  loading: boolean;
}

const InvoiceQueueContent: React.FC<InvoiceQueueContentProps> = ({
  activeTab,
  error,
  filteredInvoices,
  columns,
  onAction,
  loading
}) => {
  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center mb-4">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <p>{error}</p>
        </div>
      )}
      
      {/* All Invoices Tab */}
      <TabsContent value="all" className="m-0">
        <InvoiceTabContent 
          invoices={filteredInvoices} 
          columns={columns}
          onAction={onAction}
          loading={loading}
        />
      </TabsContent>
      
      {/* Draft Invoices Tab */}
      <TabsContent value="draft" className="m-0">
        <InvoiceTabContent 
          invoices={filteredInvoices} 
          status="draft" 
          showCaption={true} 
          columns={columns}
          onAction={onAction}
          loading={loading}
        />
      </TabsContent>
      
      {/* Sent Invoices Tab */}
      <TabsContent value="sent" className="m-0">
        <InvoiceTabContent 
          invoices={filteredInvoices} 
          status="sent" 
          showCaption={true} 
          columns={columns}
          onAction={onAction}
          loading={loading}
        />
      </TabsContent>
      
      {/* Overdue Invoices Tab */}
      <TabsContent value="overdue" className="m-0">
        <InvoiceTabContent 
          invoices={filteredInvoices} 
          status="overdue" 
          showCaption={true} 
          columns={columns}
          onAction={onAction}
          loading={loading}
        />
      </TabsContent>
      
      {/* Paid Invoices Tab */}
      <TabsContent value="paid" className="m-0">
        <InvoiceTabContent 
          invoices={filteredInvoices} 
          status="paid" 
          showCaption={true} 
          columns={columns}
          onAction={onAction}
          loading={loading}
        />
      </TabsContent>
    </>
  );
};

export default InvoiceQueueContent;
