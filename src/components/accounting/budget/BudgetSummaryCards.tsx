
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { BudgetItem } from '@/components/settings/associations/types';

interface BudgetSummaryCardsProps {
  budgetItems: BudgetItem[];
}

const BudgetSummaryCards: React.FC<BudgetSummaryCardsProps> = ({ budgetItems }) => {
  const totalBudgeted = budgetItems.reduce((sum, item) => sum + item.budgetedAmount, 0);
  const totalActual = budgetItems.reduce((sum, item) => sum + item.actualAmount, 0);
  const totalVariance = totalBudgeted - totalActual;
  
  const getVarianceBadge = (variance: number) => {
    if (variance > 0) {
      return <Badge className="bg-green-500 flex items-center gap-1"><ChevronDown size={14} /> Under Budget</Badge>;
    } else if (variance < 0) {
      return <Badge className="bg-red-500 flex items-center gap-1"><ChevronUp size={14} /> Over Budget</Badge>;
    } else {
      return <Badge className="bg-blue-500">On Budget</Badge>;
    }
  };

  return (
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
  );
};

export default BudgetSummaryCards;
