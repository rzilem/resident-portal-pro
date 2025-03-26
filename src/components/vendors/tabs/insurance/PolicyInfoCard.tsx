
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Calendar, FileCheck, AlertTriangle } from 'lucide-react';
import { format, isAfter, parseISO } from 'date-fns';
import { VendorInsurance } from '@/types/vendor';
import { InsuranceStatusBadge } from './InsuranceStatusBadge';

interface PolicyInfoCardProps {
  insurance: VendorInsurance;
}

export const PolicyInfoCard: React.FC<PolicyInfoCardProps> = ({ insurance }) => {
  const isExpired = insurance.expirationDate && 
    isAfter(new Date(), parseISO(insurance.expirationDate));
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Policy Information</CardTitle>
        <InsuranceStatusBadge expirationDate={insurance.expirationDate} />
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!insurance.policyNumber && !insurance.provider && !insurance.expirationDate ? (
          <div className="col-span-2 flex flex-col items-center justify-center py-8">
            <Shield className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">No insurance information has been added yet.</p>
            <Button variant="outline" className="mt-4">Add Insurance Details</Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Policy Number</p>
                  <p className="text-sm text-muted-foreground">{insurance.policyNumber || 'Not specified'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <FileCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Provider</p>
                  <p className="text-sm text-muted-foreground">{insurance.provider || 'Not specified'}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Expiration Date</p>
                  <div className="flex items-center">
                    <p className="text-sm text-muted-foreground">
                      {insurance.expirationDate 
                        ? format(new Date(insurance.expirationDate), 'MMM d, yyyy') 
                        : 'Not specified'}
                    </p>
                    {isExpired && (
                      <AlertTriangle className="h-4 w-4 text-destructive ml-2" />
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <FileCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Coverage Type</p>
                  <p className="text-sm text-muted-foreground">{insurance.coverageType || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
