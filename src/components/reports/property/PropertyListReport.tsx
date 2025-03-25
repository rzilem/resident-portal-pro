
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Property } from '@/components/properties/PropertyHelpers';

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
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    property.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {property.status}
                  </span>
                </TableCell>
                <TableCell>{new Date(property.foundedDate).toLocaleDateString()}</TableCell>
                <TableCell>${property.annualFees}</TableCell>
                <TableCell>{property.assessmentFrequency}</TableCell>
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
