
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Calendar, FileText } from 'lucide-react';
import { VendorInsurance } from '@/types/vendor';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface PolicyInfoCardProps {
  insurance: VendorInsurance | null | undefined;
}

const PolicyInfoCard: React.FC<PolicyInfoCardProps> = ({ insurance }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  const isExpired = insurance?.expirationDate && new Date(insurance.expirationDate) < new Date();

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Policy Information
          </CardTitle>
          {isExpired && (
            <Badge variant="destructive" className="text-xs">Expired</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-muted-foreground">Policy Number:</div>
          <div className="font-medium">{insurance?.policyNumber || 'Not specified'}</div>
          
          <div className="text-muted-foreground">Provider:</div>
          <div className="font-medium">{insurance?.provider || 'Not specified'}</div>
          
          <div className="text-muted-foreground">Expiration Date:</div>
          <div className="font-medium">
            {formatDate(insurance?.expirationDate)}
            {isExpired && (
              <span className="text-red-500 ml-2 text-xs">
                (Expired)
              </span>
            )}
          </div>
          
          {insurance?.verifiedAt && (
            <>
              <div className="text-muted-foreground">Last Verified:</div>
              <div className="font-medium">{formatDate(insurance.verifiedAt)}</div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyInfoCard;
