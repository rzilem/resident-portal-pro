
import React from 'react';
import InvoiceQueue from '@/components/accounting/InvoiceQueue';

const Accounting = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Accounting</h1>
      <InvoiceQueue />
    </div>
  );
};

export default Accounting;
