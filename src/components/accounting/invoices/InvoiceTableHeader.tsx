
import React from 'react';
import { TableHeader, TableRow, TableHead } from "@/components/ui/table";

const InvoiceTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Invoice #</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Due Date</TableHead>
        <TableHead>Recipient</TableHead>
        <TableHead className="text-right">Amount</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default InvoiceTableHeader;
