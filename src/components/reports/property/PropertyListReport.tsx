
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/components/properties/PropertyHelpers';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Calendar, MapPin, Users } from 'lucide-react';

interface PropertyListReportProps {
  properties: Property[];
  timeRange: string;
  association: string;
}

const PropertyListReport = ({ properties, timeRange, association }: PropertyListReportProps) => {
  // Calculate totals for summary stats
  const totalProperties = properties.length;
  const totalUnits = properties.reduce((sum, property) => sum + property.units, 0);
  const activeProperties = properties.filter(p => p.status === 'Active').length;
  const totalAnnualFees = properties.reduce((sum, property) => sum + property.annualFees, 0);

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Property List Report</h2>
        <p className="text-muted-foreground">
          {association} • {timeRange}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 pb-2 px-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Properties</p>
                <p className="text-2xl font-bold">{totalProperties}</p>
              </div>
              <Building className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 pb-2 px-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Units</p>
                <p className="text-2xl font-bold">{totalUnits}</p>
              </div>
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 pb-2 px-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Properties</p>
                <p className="text-2xl font-bold">{activeProperties}</p>
              </div>
              <Badge variant="outline" className="bg-green-50 border-green-200">
                {activeProperties} of {totalProperties}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 pb-2 px-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Annual Fees</p>
                <p className="text-2xl font-bold">{formatCurrency(totalAnnualFees)}</p>
              </div>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Properties Table */}
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Onboarding Date</TableHead>
                  <TableHead>Annual Fees</TableHead>
                  <TableHead>Assessment Frequency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.length > 0 ? (
                  properties.map((property, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{property.name}</TableCell>
                      <TableCell>{property.location}</TableCell>
                      <TableCell>{property.units}</TableCell>
                      <TableCell>
                        <Badge variant={property.status === 'Active' ? 'secondary' : 'outline'}>
                          {property.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(property.onboardingDate)}</TableCell>
                      <TableCell>{formatCurrency(property.annualFees)}</TableCell>
                      <TableCell className="capitalize">{property.assessmentFrequency}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">No properties data available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyListReport;
