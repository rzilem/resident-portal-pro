
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { VendorInsurance } from '@/types/vendor';

interface CoverageDetailsCardProps {
  insurance: VendorInsurance;
}

const CoverageDetailsCard: React.FC<CoverageDetailsCardProps> = ({ insurance }) => {
  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return 'Not specified';
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <DollarSign className="h-4 w-4 mr-2" />
          Coverage Details
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-muted-foreground">Coverage Amount:</div>
          <div className="font-medium">{formatCurrency(insurance.coverageAmount)}</div>
          
          <div className="text-muted-foreground">Coverage Type:</div>
          <div className="font-medium">{insurance.coverageType || 'Not specified'}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoverageDetailsCard;
