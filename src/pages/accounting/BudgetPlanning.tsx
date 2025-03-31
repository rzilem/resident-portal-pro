
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BudgetToolbar from '@/components/accounting/budget/BudgetToolbar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const BudgetPlanning = () => {
  const [activeTab, setActiveTab] = useState('current');
  
  // Sample data - in a real app this would come from your API
  const budgetItems = [
    { category: 'Maintenance', item: 'Common Area Maintenance', budgeted: 12000, actual: 10500 },
    { category: 'Maintenance', item: 'Landscape Maintenance', budgeted: 24000, actual: 23000 },
    { category: 'Utilities', item: 'Water', budgeted: 9600, actual: 10200 },
    { category: 'Utilities', item: 'Electricity', budgeted: 7200, actual: 6800 },
    { category: 'Admin', item: 'Management Fees', budgeted: 36000, actual: 36000 },
    { category: 'Admin', item: 'Insurance', budgeted: 15000, actual: 15000 },
    { category: 'Reserve', item: 'Reserve Contributions', budgeted: 30000, actual: 30000 },
  ];
  
  const handleRefresh = () => {
    toast.success('Budget data refreshed');
  };
  
  const handleExport = () => {
    toast.success('Budget exported to spreadsheet');
  };
  
  const handleNewItem = () => {
    toast.success('New budget item dialog would open here');
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Budget Planning</h1>
      </div>
      
      <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
        <BudgetToolbar activeTab={activeTab} />
        
        <TabsContent value="current" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Year Budget</CardTitle>
              <CardDescription>Budget vs. actual spending for the current fiscal year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-left py-3 px-4">Budget Item</th>
                      <th className="text-right py-3 px-4">Budgeted</th>
                      <th className="text-right py-3 px-4">Actual</th>
                      <th className="text-right py-3 px-4">Variance</th>
                      <th className="text-right py-3 px-4">% Used</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetItems.map((item, index) => {
                      const variance = item.budgeted - item.actual;
                      const percentUsed = Math.round((item.actual / item.budgeted) * 100);
                      
                      return (
                        <tr key={index} className="border-b hover:bg-muted/30">
                          <td className="py-3 px-4">{item.category}</td>
                          <td className="py-3 px-4">{item.item}</td>
                          <td className="text-right py-3 px-4">${item.budgeted.toLocaleString()}</td>
                          <td className="text-right py-3 px-4">${item.actual.toLocaleString()}</td>
                          <td className={`text-right py-3 px-4 ${variance < 0 ? 'text-red-500' : 'text-green-500'}`}>
                            ${Math.abs(variance).toLocaleString()} {variance < 0 ? 'Over' : 'Under'}
                          </td>
                          <td className="text-right py-3 px-4">
                            <span className={percentUsed > 100 ? 'text-red-500' : ''}>
                              {percentUsed}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    
                    <tr className="border-b bg-muted/40 font-medium">
                      <td className="py-3 px-4" colSpan={2}>Total</td>
                      <td className="text-right py-3 px-4">
                        ${budgetItems.reduce((sum, item) => sum + item.budgeted, 0).toLocaleString()}
                      </td>
                      <td className="text-right py-3 px-4">
                        ${budgetItems.reduce((sum, item) => sum + item.actual, 0).toLocaleString()}
                      </td>
                      <td className="text-right py-3 px-4"></td>
                      <td className="text-right py-3 px-4"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="previous">
          <Card>
            <CardHeader>
              <CardTitle>Previous Year Budget</CardTitle>
              <CardDescription>Historical budget data from the previous fiscal year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center py-12">
                <p className="text-muted-foreground">Previous year data would display here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="planning">
          <Card>
            <CardHeader>
              <CardTitle>Budget Planning</CardTitle>
              <CardDescription>Create and manage budget plans for upcoming fiscal years</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center py-12">
                <p className="text-muted-foreground">Budget planning interface would display here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetPlanning;
