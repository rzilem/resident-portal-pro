
import React from 'react';
import { Association } from '@/types/association';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/utils/formatters';

interface AssociationFinancialsTabProps {
  association: Association;
}

// Mock financial data
const mockFinancials = {
  operatingAccount: 125000.75,
  reserveAccount: 350000.50,
  outstandingDues: 15250.25,
  yearToDateIncome: 187500.00,
  yearToDateExpenses: 162300.75,
  reserveFundTarget: 400000.00
};

const AssociationFinancialsTab: React.FC<AssociationFinancialsTabProps> = ({ association }) => {
  return (
    <div className="mt-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-muted-foreground text-sm mb-1">Operating Account</div>
              <div className="font-medium text-lg">
                {formatCurrency(mockFinancials.operatingAccount, association.settings?.currencySymbol || '$')}
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-muted-foreground text-sm mb-1">Reserve Account</div>
              <div className="font-medium text-lg">
                {formatCurrency(mockFinancials.reserveAccount, association.settings?.currencySymbol || '$')}
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-muted-foreground text-sm mb-1">Outstanding Dues</div>
              <div className="font-medium text-lg">
                {formatCurrency(mockFinancials.outstandingDues, association.settings?.currencySymbol || '$')}
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">Year-to-Date Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Income:</span>
                <span className="font-medium">
                  {formatCurrency(mockFinancials.yearToDateIncome, association.settings?.currencySymbol || '$')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Expenses:</span>
                <span className="font-medium">
                  {formatCurrency(mockFinancials.yearToDateExpenses, association.settings?.currencySymbol || '$')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Net Cash Flow:</span>
                <span className="font-medium">
                  {formatCurrency(
                    mockFinancials.yearToDateIncome - mockFinancials.yearToDateExpenses, 
                    association.settings?.currencySymbol || '$'
                  )}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">Payment Settings</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fee Frequency:</span>
                <span className="font-medium capitalize">
                  {association.settings?.feesFrequency || 'Not set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Online Payments:</span>
                <span className="font-medium">
                  {association.settings?.allowOnlinePayments ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Late Fee Type:</span>
                <span className="font-medium capitalize">
                  {association.settings?.lateFeeType || 'Not set'}
                </span>
              </div>
              {association.settings?.lateFeeAmount && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Late Fee Amount:</span>
                  <span className="font-medium">
                    {formatCurrency(
                      Number(association.settings.lateFeeAmount), 
                      association.settings?.currencySymbol || '$'
                    )}
                    {association.settings?.lateFeeType === 'percentage' ? '%' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">Reserve Fund</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Balance:</span>
                <span className="font-medium">
                  {formatCurrency(mockFinancials.reserveAccount, association.settings?.currencySymbol || '$')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Target Amount:</span>
                <span className="font-medium">
                  {formatCurrency(mockFinancials.reserveFundTarget, association.settings?.currencySymbol || '$')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Funding Level:</span>
                <span className="font-medium">
                  {Math.round((mockFinancials.reserveAccount / mockFinancials.reserveFundTarget) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssociationFinancialsTab;
