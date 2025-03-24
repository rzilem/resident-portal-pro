
import React from 'react';
import { Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TransactionRecordsPlaceholder = () => {
  return (
    <div className="p-8 text-center">
      <Database className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
      <h3 className="text-lg font-medium mb-2">Transaction Records Selected</h3>
      <p className="text-muted-foreground mb-4">View and manage financial transaction data.</p>
      <Button>Load Transaction Data</Button>
    </div>
  );
};

export default TransactionRecordsPlaceholder;
