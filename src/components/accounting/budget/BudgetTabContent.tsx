
import React from 'react';
import { FileBarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import BudgetSummaryCards from './BudgetSummaryCards';
import BudgetFilters from './BudgetFilters';
import BudgetTable from './BudgetTable';
import { BudgetItem } from '@/components/settings/associations/types';

interface BudgetTabContentProps {
  tabValue: string;
  budgetItems: BudgetItem[];
}

const BudgetTabContent: React.FC<BudgetTabContentProps> = ({ tabValue, budgetItems }) => {
  if (tabValue === 'current') {
    return (
      <>
        <BudgetSummaryCards budgetItems={budgetItems} />
        <BudgetFilters />
        <BudgetTable budgetItems={budgetItems} />
      </>
    );
  }
  
  // Empty/placeholder state for other tabs
  return (
    <div className="flex justify-center items-center p-8">
      <div className="text-center">
        <FileBarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">
          {tabValue === 'previous' ? 'Previous Year Budgets' : 'Budget Planning'}
        </h3>
        <p className="text-muted-foreground mb-4">
          {tabValue === 'previous' 
            ? 'View and compare historical budget data' 
            : 'Create and plan budgets for upcoming fiscal years'}
        </p>
        <Button className="mt-2">
          {tabValue === 'previous' ? 'Load Previous Year' : 'Start Budget Planning'}
        </Button>
      </div>
    </div>
  );
};

export default BudgetTabContent;
