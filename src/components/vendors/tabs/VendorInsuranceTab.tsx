import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Vendor } from '@/types/vendor';
import { Shield, Calendar, Phone, Mail, AlertTriangle, FileCheck } from 'lucide-react';
import { format, isAfter, addMonths, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface VendorInsuranceTabProps {
  vendor: Vendor;
}

const VendorInsuranceTab: React.FC<VendorInsuranceTabProps> = ({ vendor }) => {
  const insurance = vendor.insurance || {};
  
  const isExpired = insurance.expirationDate && 
    isAfter(new Date(), parseISO(insurance.expirationDate));
  
  const isExpiringSoon = insurance.expirationDate && 
    !isExpired && 
    isAfter(addMonths(new Date(), 1), parseISO(insurance.expirationDate));
  
  const getStatusBadge = () => {
    if (!insurance.expirationDate) return null;
    
    if (isExpired) {
      return <Badge variant="destructive" className="ml-2">Expired</Badge>;
    }
    
    if (isExpiringSoon) {
      return <Badge variant="outline" className="ml-2 bg-amber-500 text-white border-amber-600">Expiring Soon</Badge>;
    }
    
    return <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-300">Active</Badge>;
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Policy Information</CardTitle>
            {getStatusBadge()}
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
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Insurance Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {!insurance.documents || insurance.documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6">
                <p className="text-muted-foreground text-center">No insurance documents have been uploaded.</p>
                <Button variant="outline" className="mt-4">Upload Documents</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {insurance.documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div className="flex items-center">
                      <FileCheck className="h-5 w-5 text-muted-foreground mr-3" />
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded on {format(new Date(doc.uploadDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Agent Information</CardTitle>
          </CardHeader>
          <CardContent>
            {!insurance.agent?.name && !insurance.agent?.email && !insurance.agent?.phone ? (
              <div className="flex flex-col items-center justify-center py-6">
                <p className="text-muted-foreground text-center">No agent information has been added.</p>
                <Button variant="outline" className="mt-4">Add Agent Details</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Agent Name</p>
                    <p className="text-sm text-muted-foreground">{insurance.agent?.name || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{insurance.agent?.email || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{insurance.agent?.phone || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
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
      </div>
    </div>
  );
};

export default VendorInsuranceTab;
