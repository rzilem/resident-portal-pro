
import React from 'react';
import { Association } from '@/types/association';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface AssociationFinancialsTabProps {
  association: Association;
}

const AssociationFinancialsTab: React.FC<AssociationFinancialsTabProps> = ({ association }) => {
  return (
    <div className="mt-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="text-muted-foreground text-sm mb-1">Fees Frequency</div>
              <div className="font-medium capitalize">
                {association.settings?.feesFrequency || 'Not set'}
              </div>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <div className="text-muted-foreground text-sm mb-1">Fiscal Year Start</div>
              <div className="font-medium">
                {association.settings?.fiscalYearStart ? 
                  new Date(`2000-${association.settings.fiscalYearStart}`).toLocaleDateString(undefined, { month: 'long', day: 'numeric' }) : 
                  'Not set'
                }
              </div>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <div className="text-muted-foreground text-sm mb-1">Currency</div>
              <div className="font-medium">
                {association.settings?.currencySymbol || '$'} ({association.settings?.currency || 'USD'})
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">Payment Settings</h3>
            <div className="space-y-2">
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
                    {association.settings?.currencySymbol || '$'}{association.settings.lateFeeAmount}
                    {association.settings?.lateFeeType === 'percentage' ? '%' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssociationFinancialsTab;
