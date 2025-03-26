
import React, { useState } from 'react';
import { FileBarChart, Calendar, Upload, Download, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import BudgetSummaryCards from './BudgetSummaryCards';
import BudgetFilters from './BudgetFilters';
import BudgetTable from './BudgetTable';
import { BudgetItem } from '@/components/settings/associations/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BudgetTabContentProps {
  tabValue: string;
  budgetItems: BudgetItem[];
}

const BudgetTabContent: React.FC<BudgetTabContentProps> = ({ tabValue, budgetItems }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedFiscalYear, setSelectedFiscalYear] = useState(new Date().getFullYear().toString());
  
  if (tabValue === 'current') {
    return (
      <>
        <BudgetSummaryCards budgetItems={budgetItems} />
        <BudgetFilters />
        <BudgetTable budgetItems={budgetItems} />
      </>
    );
  }
  
  if (tabValue === 'previous') {
    return (
      <div className="space-y-6">
        {/* Year Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Label htmlFor="yearSelect">View budget for:</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download size={16} /> Export
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ArrowUpDown size={16} /> Compare
            </Button>
          </div>
        </div>
        
        {/* Previous Year Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-md p-4 bg-background">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Budget ({selectedYear})</h3>
            <p className="text-2xl font-bold">$72,500</p>
            <p className="text-sm text-muted-foreground mt-2">15 budget categories</p>
          </div>
          <div className="border rounded-md p-4 bg-background">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Actual Spend ({selectedYear})</h3>
            <p className="text-2xl font-bold">$71,230</p>
            <p className="text-sm text-muted-foreground mt-2">98% of allocated budget</p>
          </div>
          <div className="border rounded-md p-4 bg-background">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Yearly Variance</h3>
            <p className="text-2xl font-bold text-green-600">$1,270</p>
            <p className="text-sm text-muted-foreground mt-2">Under budget by 1.8%</p>
          </div>
        </div>
        
        {/* Sample table - in a real app, this would show filtered data */}
        <div className="rounded-md border mt-6">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="py-3 px-4 text-left font-medium">Category</th>
                <th className="py-3 px-4 text-left font-medium">Budgeted</th>
                <th className="py-3 px-4 text-left font-medium">Actual</th>
                <th className="py-3 px-4 text-left font-medium">Variance</th>
                <th className="py-3 px-4 text-left font-medium">%</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">Maintenance</td>
                <td className="py-3 px-4">$24,000</td>
                <td className="py-3 px-4">$23,456</td>
                <td className="py-3 px-4 text-green-600">$544</td>
                <td className="py-3 px-4">2.3%</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">Landscaping</td>
                <td className="py-3 px-4">$18,500</td>
                <td className="py-3 px-4">$18,974</td>
                <td className="py-3 px-4 text-red-600">-$474</td>
                <td className="py-3 px-4">-2.6%</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">Insurance</td>
                <td className="py-3 px-4">$30,000</td>
                <td className="py-3 px-4">$28,800</td>
                <td className="py-3 px-4 text-green-600">$1,200</td>
                <td className="py-3 px-4">4.0%</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-center mt-4">
          <Button variant="outline">View Complete Report</Button>
        </div>
      </div>
    );
  }
  
  if (tabValue === 'planning') {
    return (
      <div className="space-y-6">
        {/* Fiscal Year Planning */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Label htmlFor="fiscalYearSelect">Planning for fiscal year:</Label>
            <Select value={selectedFiscalYear} onValueChange={setSelectedFiscalYear}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Upload size={16} /> Import
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Calendar size={16} /> Schedule
            </Button>
            <Button size="sm" className="flex items-center gap-1">
              Save Draft
            </Button>
          </div>
        </div>
        
        {/* Planning Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4 border rounded-md p-4">
            <h3 className="font-medium">Budget Allocations</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="totalBudget">Total Budget for {selectedFiscalYear}</Label>
                <Input id="totalBudget" type="text" placeholder="$75,000" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="reserve">Reserve Fund Allocation (%)</Label>
                <Input id="reserve" type="text" placeholder="20%" className="mt-1" />
              </div>
              <div className="pt-2">
                <Button className="w-full">Calculate Allocations</Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 border rounded-md p-4">
            <h3 className="font-medium">Important Dates</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="draftDate">Draft Completion</Label>
                <Input id="draftDate" type="date" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="reviewDate">Board Review Date</Label>
                <Input id="reviewDate" type="date" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="approvalDate">Expected Approval Date</Label>
                <Input id="approvalDate" type="date" className="mt-1" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Budget Categories */}
        <div className="border rounded-md p-4 space-y-4">
          <h3 className="font-medium">Budget Categories</h3>
          <p className="text-sm text-muted-foreground">Adjust allocations for each category based on projections</p>
          
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label>Maintenance (Previous: $24,000)</Label>
              <div className="flex space-x-4">
                <Input type="text" placeholder="$26,000" className="flex-1" />
                <Select defaultValue="increase">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Change" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="increase">Increase</SelectItem>
                    <SelectItem value="decrease">Decrease</SelectItem>
                    <SelectItem value="same">Same</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Label>Landscaping (Previous: $18,500)</Label>
              <div className="flex space-x-4">
                <Input type="text" placeholder="$19,000" className="flex-1" />
                <Select defaultValue="increase">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Change" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="increase">Increase</SelectItem>
                    <SelectItem value="decrease">Decrease</SelectItem>
                    <SelectItem value="same">Same</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Label>Insurance (Previous: $30,000)</Label>
              <div className="flex space-x-4">
                <Input type="text" placeholder="$32,000" className="flex-1" />
                <Select defaultValue="increase">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Change" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="increase">Increase</SelectItem>
                    <SelectItem value="decrease">Decrease</SelectItem>
                    <SelectItem value="same">Same</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Button variant="outline" className="mt-2">+ Add Category</Button>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline">Cancel</Button>
          <Button>Save Budget Plan</Button>
        </div>
      </div>
    );
  }
  
  // Default fallback if no valid tab is selected
  return (
    <div className="flex justify-center items-center p-8">
      <div className="text-center">
        <FileBarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Select a budget view</h3>
        <p className="text-muted-foreground mb-4">
          Choose a tab above to view or manage budget information
        </p>
      </div>
    </div>
  );
};

export default BudgetTabContent;
