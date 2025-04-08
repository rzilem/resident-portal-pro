
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Shield } from 'lucide-react';
import { VendorInsurance } from '@/types/vendor';
import { Badge } from '@/components/ui/badge';

interface CoverageDetailsCardProps {
  insurance: VendorInsurance | null | undefined;
}

const CoverageDetailsCard: React.FC<CoverageDetailsCardProps> = ({ insurance }) => {
  const formatCurrency = (amount?: number | null) => {
    if (amount === undefined || amount === null) return 'Not specified';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const getVerificationStatusBadge = () => {
    if (!insurance?.verificationStatus) return null;
    
    switch (insurance.verificationStatus) {
      case 'verified':
        return <Badge className="bg-green-500">Verified</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending Verification</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Verification Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            Coverage Details
          </CardTitle>
          {getVerificationStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-muted-foreground">Coverage Amount:</div>
          <div className="font-medium">{formatCurrency(insurance?.coverageAmount)}</div>
          
          <div className="text-muted-foreground">Coverage Type:</div>
          <div className="font-medium">{insurance?.coverageType || 'Not specified'}</div>
          
          {insurance?.nextVerificationDate && (
            <>
              <div className="text-muted-foreground">Next Verification:</div>
              <div className="font-medium">
                {new Date(insurance.nextVerificationDate).toLocaleDateString()}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoverageDetailsCard;
