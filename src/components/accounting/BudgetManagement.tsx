
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FileBarChart } from "lucide-react";
import { BudgetItem } from '@/components/settings/associations/types';
import BudgetToolbar from './budget/BudgetToolbar';
import BudgetTabContent from './budget/BudgetTabContent';
import { Button } from "@/components/ui/button";

interface BudgetManagementProps {
  className?: string;
  associationId?: string;
}

const BudgetManagement: React.FC<BudgetManagementProps> = ({ className, associationId }) => {
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
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <FileBarChart className="h-5 w-5" />
          Budget Management
        </CardTitle>
        <CardDescription>
          Track and manage budget vs. actual expenses
          {associationId && <span className="ml-1">for the selected association</span>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current" className="space-y-4" onValueChange={setActiveTab}>
          <BudgetToolbar activeTab={activeTab} />
          
          <TabsContent value="current" className="m-0">
            <BudgetTabContent tabValue="current" budgetItems={budgetItems} />
          </TabsContent>
          
          <TabsContent value="previous" className="m-0">
            <BudgetTabContent tabValue="previous" budgetItems={[]} />
          </TabsContent>
          
          <TabsContent value="planning" className="m-0">
            <BudgetTabContent tabValue="planning" budgetItems={[]} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BudgetManagement;
