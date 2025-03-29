
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Calendar, FileText } from 'lucide-react';
import { VendorInsurance } from '@/types/vendor';
import { format } from 'date-fns';

interface PolicyInfoCardProps {
  insurance: VendorInsurance;
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

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <Shield className="h-4 w-4 mr-2" />
          Policy Information
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-muted-foreground">Policy Number:</div>
          <div className="font-medium">{insurance.policyNumber || 'Not specified'}</div>
          
          <div className="text-muted-foreground">Provider:</div>
          <div className="font-medium">{insurance.provider || 'Not specified'}</div>
          
          <div className="text-muted-foreground">Expiration Date:</div>
          <div className="font-medium">{formatDate(insurance.expirationDate)}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyInfoCard;
