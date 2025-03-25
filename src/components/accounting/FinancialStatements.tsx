
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  BarChart4,
  TrendingUp,
  Download, 
  Printer,
  Calendar,
  Share2
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FinancialStatementsProps {
  className?: string;
  associationId?: string;
}

const FinancialStatements: React.FC<FinancialStatementsProps> = ({ className, associationId }) => {
  const [activeTab, setActiveTab] = useState('balanceSheet');
  
  // Sample balance sheet data
  const balanceSheetData = {
    assets: [
      { id: 'A001', account: 'Cash and Cash Equivalents', amount: 156789.45 },
      { id: 'A002', account: 'Accounts Receivable', amount: 42567.89 },
      { id: 'A003', account: 'Reserve Fund Investments', amount: 350000.00 },
      { id: 'A004', account: 'Prepaid Insurance', amount: 12500.00 },
      { id: 'A005', account: 'Property and Equipment', amount: 75000.00 }
    ],
    liabilities: [
      { id: 'L001', account: 'Accounts Payable', amount: 28456.78 },
      { id: 'L002', account: 'Accrued Expenses', amount: 15600.00 },
      { id: 'L003', account: 'Prepaid Assessments', amount: 31250.00 },
      { id: 'L004', account: 'Long-term Loans', amount: 125000.00 }
    ],
    equity: [
      { id: 'E001', account: 'Operating Fund', amount: 87550.56 },
      { id: 'E002', account: 'Reserve Fund', amount: 350000.00 }
    ]
  };
  
  // Sample income statement data
  const incomeStatementData = {
    revenue: [
      { id: 'R001', account: 'Regular Assessments', amount: 450000.00 },
      { id: 'R002', account: 'Special Assessments', amount: 75000.00 },
      { id: 'R003', account: 'Interest Income', amount: 12500.00 },
      { id: 'R004', account: 'Late Fees and Fines', amount: 8750.00 },
      { id: 'R005', account: 'Other Income', amount: 5600.00 }
    ],
    expenses: [
      { id: 'E001', account: 'Management Fees', amount: 120000.00 },
      { id: 'E002', account: 'Landscaping and Grounds', amount: 85000.00 },
      { id: 'E003', account: 'Utilities', amount: 65000.00 },
      { id: 'E004', account: 'Repairs and Maintenance', amount: 95000.00 },
      { id: 'E005', account: 'Insurance', amount: 45000.00 },
      { id: 'E006', account: 'Administrative Expenses', amount: 25000.00 },
      { id: 'E007', account: 'Legal and Professional', amount: 18500.00 },
      { id: 'E008', account: 'Reserve Contributions', amount: 75000.00 }
    ]
  };
  
  // Calculate totals
  const totalAssets = balanceSheetData.assets.reduce((sum, item) => sum + item.amount, 0);
  const totalLiabilities = balanceSheetData.liabilities.reduce((sum, item) => sum + item.amount, 0);
  const totalEquity = balanceSheetData.equity.reduce((sum, item) => sum + item.amount, 0);
  
  const totalRevenue = incomeStatementData.revenue.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = incomeStatementData.expenses.reduce((sum, item) => sum + item.amount, 0);
  const netIncome = totalRevenue - totalExpenses;
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Financial Statements
        </CardTitle>
        <CardDescription>
          View and generate financial reports
          {associationId && <span className="ml-1">for the selected association</span>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="balanceSheet" className="space-y-4" onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 items-start sm:items-center">
            <TabsList>
              <TabsTrigger value="balanceSheet" className="flex items-center gap-1">
                <FileText size={14} /> Balance Sheet
              </TabsTrigger>
              <TabsTrigger value="incomeStatement" className="flex items-center gap-1">
                <BarChart4 size={14} /> Income Statement
              </TabsTrigger>
              <TabsTrigger value="cashFlow" className="flex items-center gap-1">
                <TrendingUp size={14} /> Cash Flow
              </TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Select defaultValue="2023">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="q4">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="q1">Q1</SelectItem>
                  <SelectItem value="q2">Q2</SelectItem>
                  <SelectItem value="q3">Q3</SelectItem>
                  <SelectItem value="q4">Q4</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mb-4">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Calendar size={16} /> Change Period
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Printer size={16} /> Print
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download size={16} /> Export
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Share2 size={16} /> Share
            </Button>
          </div>
          
          <TabsContent value="balanceSheet" className="m-0">
            <div className="rounded-md border mb-6">
              <Table>
                <TableCaption>Balance Sheet as of December 31, 2023</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead colSpan={3} className="font-bold text-lg">Assets</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {balanceSheetData.assets.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.account}</TableCell>
                      <TableCell className="text-right">${item.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold">
                    <TableCell colSpan={2}>Total Assets</TableCell>
                    <TableCell className="text-right">${totalAssets.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div className="rounded-md border mb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead colSpan={3} className="font-bold text-lg">Liabilities</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {balanceSheetData.liabilities.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.account}</TableCell>
                      <TableCell className="text-right">${item.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold">
                    <TableCell colSpan={2}>Total Liabilities</TableCell>
                    <TableCell className="text-right">${totalLiabilities.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead colSpan={3} className="font-bold text-lg">Equity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {balanceSheetData.equity.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.account}</TableCell>
                      <TableCell className="text-right">${item.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold">
                    <TableCell colSpan={2}>Total Equity</TableCell>
                    <TableCell className="text-right">${totalEquity.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                  </TableRow>
                  <TableRow className="font-bold text-lg">
                    <TableCell colSpan={2}>Total Liabilities and Equity</TableCell>
                    <TableCell className="text-right">${(totalLiabilities + totalEquity).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="incomeStatement" className="m-0">
            <div className="rounded-md border mb-6">
              <Table>
                <TableCaption>Income Statement for the Year Ended December 31, 2023</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead colSpan={3} className="font-bold text-lg">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomeStatementData.revenue.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.account}</TableCell>
                      <TableCell className="text-right">${item.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold">
                    <TableCell colSpan={2}>Total Revenue</TableCell>
                    <TableCell className="text-right">${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div className="rounded-md border mb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead colSpan={3} className="font-bold text-lg">Expenses</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomeStatementData.expenses.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.account}</TableCell>
                      <TableCell className="text-right">${item.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold">
                    <TableCell colSpan={2}>Total Expenses</TableCell>
                    <TableCell className="text-right">${totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableBody>
                  <TableRow className="font-bold text-lg">
                    <TableCell colSpan={2}>Net Income</TableCell>
                    <TableCell className="text-right">${netIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="cashFlow" className="m-0">
            <div className="flex justify-center items-center p-8">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Cash Flow Statement</h3>
                <p className="text-muted-foreground mb-4">
                  Track the flow of cash in and out of the association
                </p>
                <Button className="mt-2">
                  Generate Cash Flow Statement
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FinancialStatements;
