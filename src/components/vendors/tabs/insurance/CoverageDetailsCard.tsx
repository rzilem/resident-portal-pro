
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { isAfter, addMonths, parseISO } from 'date-fns';
import { VendorInsurance } from '@/types/vendor';

interface CoverageDetailsCardProps {
  insurance: VendorInsurance;
}

export const CoverageDetailsCard: React.FC<CoverageDetailsCardProps> = ({ insurance }) => {
  const isExpired = insurance.expirationDate && 
    isAfter(new Date(), parseISO(insurance.expirationDate));
  
  const isExpiringSoon = insurance.expirationDate && 
    !isExpired && 
    isAfter(addMonths(new Date(), 1), parseISO(insurance.expirationDate));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Coverage Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Coverage Amount</p>
            <p className="text-sm text-muted-foreground">
              {insurance.coverageAmount 
                ? `$${insurance.coverageAmount.toLocaleString()}` 
                : 'Not specified'}
            </p>
          </div>
          
          {isExpiringSoon && (
            <div className="flex p-3 bg-amber-50 border border-amber-200 rounded-md mt-4">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Insurance Expiring Soon</p>
                <p>The vendor's insurance policy will expire in less than 30 days. Consider following up.</p>
              </div>
            </div>
          )}
          
          {isExpired && (
            <div className="flex p-3 bg-red-50 border border-red-200 rounded-md mt-4">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p className="font-medium">Insurance Expired</p>
                <p>The vendor's insurance policy has expired. Immediate attention required.</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
