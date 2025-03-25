
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import FinancialReports from '@/components/reports/FinancialReports';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AccountingReports = () => {
  const [timeRange, setTimeRange] = useState('year');
  const [association, setAssociation] = useState('all');
  const [selectedReport, setSelectedReport] = useState('income-expense');

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Accounting Reports</h1>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={association} onValueChange={setAssociation}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select association" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Associations</SelectItem>
                <SelectItem value="oakwood">Oakwood HOA</SelectItem>
                <SelectItem value="pinecrest">Pinecrest Condos</SelectItem>
                <SelectItem value="riverdale">Riverdale Community</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">Export</Button>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle>Report Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedReport} onValueChange={setSelectedReport} className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
                <TabsTrigger value="income-expense">Income & Expense</TabsTrigger>
                <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
                <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
                <TabsTrigger value="forecast">Cash Forecast</TabsTrigger>
                <TabsTrigger value="bank-balances">Bank Balances</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
        
        <FinancialReports 
          timeRange={timeRange}
          association={association}
          selectedReport={selectedReport}
        />
      </div>
    </DashboardLayout>
  );
};

export default AccountingReports;
