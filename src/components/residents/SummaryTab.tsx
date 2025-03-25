
import React from 'react';
import { User, Mail, Phone, Calendar, Building, Home, MapPin, CircleDollarSign, CreditCard, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ResidentProfile } from '@/types/resident';

interface SummaryTabProps {
  resident: ResidentProfile;
}

const SummaryTab: React.FC<SummaryTabProps> = ({ resident }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resident Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start">
            <User className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm text-muted-foreground">{resident.name}</p>
            </div>
          </div>
          <div className="flex items-start">
            <Mail className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{resident.email}</p>
            </div>
          </div>
          <div className="flex items-start">
            <Phone className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">{resident.phone}</p>
            </div>
          </div>
          <div className="flex items-start">
            <Calendar className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Move-in Date</p>
              <p className="text-sm text-muted-foreground">{resident.moveInDate}</p>
            </div>
          </div>
          {resident.moveOutDate && (
            <div className="flex items-start">
              <Calendar className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Move-out Date</p>
                <p className="text-sm text-muted-foreground">{resident.moveOutDate}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Property Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start">
            <Building className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Property</p>
              <p className="text-sm text-muted-foreground">{resident.property}</p>
            </div>
          </div>
          <div className="flex items-start">
            <Home className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Unit</p>
              <p className="text-sm text-muted-foreground">{resident.unit}</p>
            </div>
          </div>
          {resident.propertyDetails && (
            <>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{resident.propertyDetails.address}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium">Bedrooms</p>
                  <p className="text-sm text-muted-foreground">{resident.propertyDetails.bedrooms}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Bathrooms</p>
                  <p className="text-sm text-muted-foreground">{resident.propertyDetails.bathrooms}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Square Feet</p>
                  <p className="text-sm text-muted-foreground">{resident.propertyDetails.sqft}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Financial Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start">
            <CircleDollarSign className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Current Balance</p>
              <p className="text-sm font-semibold">{resident.balance}</p>
            </div>
          </div>
          
          {resident.lastPayment && (
            <div className="flex items-start">
              <CreditCard className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Last Payment</p>
                <p className="text-sm text-muted-foreground">
                  {resident.lastPayment.amount} on {resident.lastPayment.date} via {resident.lastPayment.method}
                </p>
              </div>
            </div>
          )}
          
          {resident.paymentPreference && (
            <div className="flex items-start">
              <CreditCard className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Payment Method</p>
                <p className="text-sm text-muted-foreground">{resident.paymentPreference}</p>
              </div>
            </div>
          )}
          
          {resident.propertyDetails?.monthlyAssessment && (
            <div className="flex items-start">
              <CircleDollarSign className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Monthly Assessment</p>
                <p className="text-sm text-muted-foreground">{resident.propertyDetails.monthlyAssessment}</p>
              </div>
            </div>
          )}
          
          {resident.propertyDetails?.leaseStart && resident.propertyDetails?.leaseEnd && (
            <div className="flex items-start">
              <FileText className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Ownership Period</p>
                <p className="text-sm text-muted-foreground">
                  {resident.propertyDetails.leaseStart} to {resident.propertyDetails.leaseEnd}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryTab;
