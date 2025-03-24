
import React, { useState } from 'react';
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
  FileBarChart,
  UserCheck,
  FileCheck,
  ReceiptText
} from "lucide-react";
import InvoiceQueue from '@/components/accounting/InvoiceQueue';
import InteractionTracker from '@/components/interactions/InteractionTracker';
import BudgetManagement from '@/components/accounting/BudgetManagement';
import FinancialStatements from '@/components/accounting/FinancialStatements';
import VendorPayments from '@/components/accounting/VendorPayments';
import FinancialDocuments from '@/components/accounting/FinancialDocuments';
import { Link } from 'react-router-dom';

const AccountingDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

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
      
      {/* Main Tabs */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <DollarSign size={14} /> Overview
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-1">
            <ReceiptText size={14} /> Invoices
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-1">
            <CreditCard size={14} /> Transactions
          </TabsTrigger>
          <TabsTrigger value="budget" className="flex items-center gap-1">
            <BarChart4 size={14} /> Budget
          </TabsTrigger>
          <TabsTrigger value="statements" className="flex items-center gap-1">
            <FileBarChart size={14} /> Statements
          </TabsTrigger>
          <TabsTrigger value="vendors" className="flex items-center gap-1">
            <Building size={14} /> Vendors
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-1">
            <FileCheck size={14} /> Documents
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Financial Summary Cards */}
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
          
          {/* Quick Access Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ReceiptText className="h-5 w-5" /> Latest Invoices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">INV2023-004</span>
                    <span className="font-medium">$750.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">INV2023-003</span>
                    <span className="font-medium">$250.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">INV2023-002</span>
                    <span className="font-medium">$450.00</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/accounting/invoices">View All Invoices</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5" /> Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Payment Received</span>
                    <span className="font-medium text-green-600">+$450.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Vendor Payment</span>
                    <span className="font-medium text-red-600">-$750.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Late Fee</span>
                    <span className="font-medium text-green-600">+$25.00</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/accounting/transactions">View All Transactions</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UserCheck className="h-5 w-5" /> Recent Interactions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Payment Confirmation Email</span>
                    <span className="text-xs">Today</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Invoice Reminder Call</span>
                    <span className="text-xs">Yesterday</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Late Payment Notice</span>
                    <span className="text-xs">3 days ago</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab('interactions')}>
                  View All Interactions
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-4">
          <InvoiceQueue />
        </TabsContent>
        
        {/* Transactions Tab */}
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
                  <Button className="mt-2" asChild>
                    <Link to="/accounting/transactions">Go to Transactions</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Budget Tab */}
        <TabsContent value="budget" className="space-y-4">
          <BudgetManagement />
        </TabsContent>
        
        {/* Financial Statements Tab */}
        <TabsContent value="statements" className="space-y-4">
          <FinancialStatements />
        </TabsContent>
        
        {/* Vendor Payments Tab */}
        <TabsContent value="vendors" className="space-y-4">
          <VendorPayments />
        </TabsContent>
        
        {/* Financial Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <FinancialDocuments />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountingDashboard;
