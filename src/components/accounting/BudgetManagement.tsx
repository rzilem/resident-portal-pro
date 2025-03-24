
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileBarChart, 
  DollarSign,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Filter, 
  RefreshCw, 
  Download, 
  PlusCircle, 
  Search
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BudgetItem } from '@/components/settings/associations/types';

interface BudgetManagementProps {
  className?: string;
}

const BudgetManagement: React.FC<BudgetManagementProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('current');
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    {
      id: "BUDGET-001",
      category: "Maintenance",
      description: "Pool Maintenance",
      budgetedAmount: 12000,
      actualAmount: 11500,
      variance: 500,
      fiscalYear: "2023",
      associationId: "ASSOC-001"
    },
    {
      id: "BUDGET-002",
      category: "Utilities",
      description: "Common Area Electricity",
      budgetedAmount: 9000,
      actualAmount: 9750,
      variance: -750,
      fiscalYear: "2023",
      associationId: "ASSOC-001"
    },
    {
      id: "BUDGET-003",
      category: "Insurance",
      description: "Property Insurance Premium",
      budgetedAmount: 18000,
      actualAmount: 18000,
      variance: 0,
      fiscalYear: "2023",
      associationId: "ASSOC-001"
    },
    {
      id: "BUDGET-004",
      category: "Landscaping",
      description: "Garden Maintenance",
      budgetedAmount: 8500,
      actualAmount: 7900,
      variance: 600,
      fiscalYear: "2023",
      associationId: "ASSOC-001"
    },
    {
      id: "BUDGET-005",
      category: "Administrative",
      description: "Management Fees",
      budgetedAmount: 24000,
      actualAmount: 24000,
      variance: 0,
      fiscalYear: "2023",
      associationId: "ASSOC-001"
    }
  ]);
  
  const getVarianceBadge = (variance: number) => {
    if (variance > 0) {
      return <Badge className="bg-green-500 flex items-center gap-1"><ChevronDown size={14} /> Under Budget</Badge>;
    } else if (variance < 0) {
      return <Badge className="bg-red-500 flex items-center gap-1"><ChevronUp size={14} /> Over Budget</Badge>;
    } else {
      return <Badge className="bg-blue-500">On Budget</Badge>;
    }
  };
  
  const totalBudgeted = budgetItems.reduce((sum, item) => sum + item.budgetedAmount, 0);
  const totalActual = budgetItems.reduce((sum, item) => sum + item.actualAmount, 0);
  const totalVariance = totalBudgeted - totalActual;
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <FileBarChart className="h-5 w-5" />
          Budget Management
        </CardTitle>
        <CardDescription>
          Track and manage budget vs. actual expenses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current" className="space-y-4" onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 items-start sm:items-center">
            <TabsList>
              <TabsTrigger value="current">Current Year</TabsTrigger>
              <TabsTrigger value="previous">Previous Year</TabsTrigger>
              <TabsTrigger value="planning">Planning</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <RefreshCw size={16} /> Refresh
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download size={16} /> Export
              </Button>
              <Button size="sm" className="flex items-center gap-1">
                <PlusCircle size={16} /> New Budget Item
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input 
                  placeholder="Search budget items..." 
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 pl-8 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter size={16} />
              </Button>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="landscaping">Landscaping</SelectItem>
                  <SelectItem value="administrative">Administrative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value="current" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Budgeted</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalBudgeted.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Actual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalActual.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Variance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold">${Math.abs(totalVariance).toLocaleString()}</div>
                    {getVarianceBadge(totalVariance)}
                  </div>
                </CardContent>
              </Card>
            </div>
          
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Budgeted</TableHead>
                    <TableHead className="text-right">Actual</TableHead>
                    <TableHead className="text-right">Variance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgetItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">${item.budgetedAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${item.actualAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${Math.abs(item.variance).toLocaleString()}</TableCell>
                      <TableCell>{getVarianceBadge(item.variance)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="previous" className="m-0">
            <div className="flex justify-center items-center p-8">
              <div className="text-center">
                <FileBarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Previous Year Budgets</h3>
                <p className="text-muted-foreground mb-4">
                  View and compare historical budget data
                </p>
                <Button className="mt-2">
                  Load Previous Year
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="planning" className="m-0">
            <div className="flex justify-center items-center p-8">
              <div className="text-center">
                <FileBarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Budget Planning</h3>
                <p className="text-muted-foreground mb-4">
                  Create and plan budgets for upcoming fiscal years
                </p>
                <Button className="mt-2">
                  Start Budget Planning
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BudgetManagement;
