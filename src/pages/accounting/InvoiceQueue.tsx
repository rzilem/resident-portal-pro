
import React from 'react';
import InvoiceQueue from '@/components/accounting/InvoiceQueue';
import { useAssociations } from '@/hooks/use-associations';

const InvoiceQueuePage = () => {
  const { activeAssociation } = useAssociations();

  return (
    <div className="space-y-6 p-4 md:p-6">
      <InvoiceQueue associationId={activeAssociation?.id} />
    </div>
  );
};

export default InvoiceQueuePage;
