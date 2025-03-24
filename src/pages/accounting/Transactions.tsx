
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';

const Transactions = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader />
      
      <div className="flex-1 p-4 md:p-6">
        <div className="grid gap-4 md:gap-6 mb-6">
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">
            Manage all financial transactions for your properties
          </p>
        </div>
        
        {/* TODO: Add transactions content */}
        <div className="bg-muted/30 border rounded-lg p-8 text-center">
          <h2 className="text-xl mb-2">Transactions Module</h2>
          <p className="text-muted-foreground">
            This area will contain transaction listings, filters, and management tools.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
