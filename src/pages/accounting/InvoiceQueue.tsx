
import React from 'react';
import InvoiceQueue from '@/components/accounting/InvoiceQueue';
import { useAssociations } from '@/hooks/use-associations';

const InvoiceQueuePage = () => {
  const { activeAssociation } = useAssociations();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Invoice Queue</h1>
          <p className="text-muted-foreground">
            Manage invoices, track payments, and process billing
          </p>
        </div>
      </div>

      <InvoiceQueue associationId={activeAssociation?.id} />
    </div>
  );
};

export default InvoiceQueuePage;
