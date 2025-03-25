
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PropertyDetails } from '@/types/resident';

interface PropertyTabProps {
  propertyDetails?: PropertyDetails;
  status?: string;
}

const PropertyTab: React.FC<PropertyTabProps> = ({ propertyDetails, status }) => {
  if (!propertyDetails) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No property details available
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Details</CardTitle>
        <CardDescription>
          Information about the resident's unit and property
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Unit Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Square Footage</p>
                  <p className="text-muted-foreground">{propertyDetails.sqft} sq ft</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Bedrooms</p>
                  <p className="text-muted-foreground">{propertyDetails.bedrooms}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Bathrooms</p>
                  <p className="text-muted-foreground">{propertyDetails.bathrooms}</p>
                </div>
              </div>
              
              <div className="border p-3 rounded-md bg-slate-50 mt-2">
                <h4 className="font-medium text-sm mb-2">Property Tax Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Tax District</p>
                    <p className="text-muted-foreground">{propertyDetails.taxDistrict || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Tax ID</p>
                    <p className="text-muted-foreground font-mono">{propertyDetails.taxId || 'N/A'}</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  <a 
                    href="https://hometaxshield.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center gap-1"
                  >
                    View on HomeTaxShield
                    <ArrowLeft className="h-3 w-3 rotate-180" />
                  </a>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium">Full Address</p>
                <p className="text-muted-foreground">{propertyDetails.address}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Ownership Information</h3>
            <div className="space-y-4">
              {propertyDetails.leaseStart && propertyDetails.leaseEnd && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Start Date</p>
                      <p className="text-muted-foreground">{propertyDetails.leaseStart}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">End Date</p>
                      <p className="text-muted-foreground">{propertyDetails.leaseEnd}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Monthly Assessment</p>
                      <p className="text-muted-foreground">{propertyDetails.monthlyAssessment}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Security Deposit</p>
                      <p className="text-muted-foreground">{propertyDetails.deposit}</p>
                    </div>
                  </div>
                </>
              )}
              
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline">View Ownership Documents</Button>
                {status === 'Active' && (
                  <Button>Manage Ownership</Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyTab;
