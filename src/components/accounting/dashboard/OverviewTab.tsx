
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  FileText, 
  CreditCard, 
  BanknoteIcon,
  Wallet,
  UserCheck
} from "lucide-react";
import { Link } from 'react-router-dom';

const OverviewTab = () => {
  return (
    <div className="space-y-6">
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
              <FileText className="h-5 w-5" /> Latest Invoices
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
            <Button variant="outline" className="w-full">
              View All Interactions
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
