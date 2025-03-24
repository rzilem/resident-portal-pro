
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BarChart4, 
  DollarSign, 
  CalendarIcon, 
  FileText, 
  CreditCard, 
  Building, 
  BanknoteIcon,
  Wallet,
  FileBarChart
} from "lucide-react";
import InvoiceQueue from '@/components/accounting/InvoiceQueue';
import InteractionTracker from '@/components/interactions/InteractionTracker';

const AccountingDashboard = () => {
  return (
    <div className="flex-1">
      <div className="grid gap-4 md:gap-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Accounting Dashboard</h1>
            <p className="text-muted-foreground">
              Manage all financial aspects of your properties and associations
            </p>
          </div>
        </div>
      </div>
      
      {/* Financial Overview Section */}
      <div className="grid gap-4 md:gap-6 mb-6">
        <h2 className="text-xl font-semibold">Financial Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">$24,358.50</div>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +12.5% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding Balances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">$7,849.32</div>
                <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                -3.2% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Reserve Funds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">$143,290.75</div>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +1.8% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">12</div>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                5 high priority
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList className="grid w-full md:w-auto grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="invoices" className="flex items-center gap-1">
            <FileText size={14} /> Invoices
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-1">
            <CreditCard size={14} /> Transactions
          </TabsTrigger>
          <TabsTrigger value="budget" className="flex items-center gap-1">
            <BarChart4 size={14} /> Budget
          </TabsTrigger>
          <TabsTrigger value="interactions" className="flex items-center gap-1">
            <Building size={14} /> Interactions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="invoices" className="space-y-4">
          <InvoiceQueue />
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Management</CardTitle>
              <CardDescription>
                View and manage all financial transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center p-8">
                <div className="text-center">
                  <FileBarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Transaction Overview</h3>
                  <p className="text-muted-foreground mb-4">
                    View transaction details in the Transactions page
                  </p>
                  <Button className="mt-2">
                    Go to Transactions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Management</CardTitle>
              <CardDescription>
                Create and manage budgets for your associations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center p-8">
                <div className="text-center">
                  <BarChart4 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Budget Planning</h3>
                  <p className="text-muted-foreground mb-4">
                    Create budgets, track expenses, and plan for future costs
                  </p>
                  <Button className="mt-2">
                    Create New Budget
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="interactions" className="space-y-4">
          <InteractionTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountingDashboard;
