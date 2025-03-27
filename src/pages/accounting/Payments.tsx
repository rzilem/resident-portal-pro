
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionManagement from '@/components/accounting/TransactionManagement';
import PaymentMethods from '@/components/accounting/PaymentMethods';
import PaymentReporting from '@/components/accounting/PaymentReporting';

const Payments = () => {
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="grid gap-4 md:gap-6 mb-6">
        <h1 className="text-2xl font-bold">Payment Management</h1>
        <p className="text-muted-foreground">
          Process payments, manage transactions, and configure payment methods for your associations
        </p>
      </div>
      
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid w-full md:w-auto grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="transactions">Transaction Management</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="reports">Reports & Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions">
          <TransactionManagement />
        </TabsContent>
        
        <TabsContent value="methods">
          <PaymentMethods />
        </TabsContent>
        
        <TabsContent value="reports">
          <PaymentReporting />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payments;
