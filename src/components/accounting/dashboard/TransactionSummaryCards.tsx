
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, CreditCard } from "lucide-react";
import { formatCurrency } from "@/components/reports/financial/utils/formatters";

interface TransactionSummaryCardsProps {
  totalCredits: number;
  totalDebits: number;
}

const TransactionSummaryCards: React.FC<TransactionSummaryCardsProps> = ({ 
  totalCredits, 
  totalDebits 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Inflow</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCredits)}</p>
            </div>
            <ArrowDownCircle className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Outflow</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDebits)}</p>
            </div>
            <ArrowUpCircle className="h-8 w-8 text-red-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Net Flow</p>
              <p className={`text-2xl font-bold ${totalCredits - totalDebits >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalCredits - totalDebits)}
              </p>
            </div>
            <CreditCard className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionSummaryCards;
