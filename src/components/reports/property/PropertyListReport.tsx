
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/components/properties/PropertyHelpers';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface PropertyListReportProps {
  properties: Property[];
  timeRange: string;
  association: string;
}

const PropertyListReport = ({ properties, timeRange, association }: PropertyListReportProps) => {
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Units</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Founded Date</TableHead>
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
                <TableCell>{formatDate(property.foundedDate)}</TableCell>
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
  );
};

export default PropertyListReport;
