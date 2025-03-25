
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, CalendarClock, DollarSign, MapPin, MapPinned, Building2, FileText, Briefcase } from 'lucide-react';
import { PropertyColumn } from './PropertyColumnsSelector';

interface PropertyTableProps {
  properties: any[];
  columns: PropertyColumn[];
}

const PropertyTable = ({ properties, columns }: PropertyTableProps) => {
  const renderBooleanValue = (value: boolean) => (
    <span className="flex items-center">
      {value ? (
        <Check className="h-4 w-4 text-green-600 mr-1" />
      ) : (
        <X className="h-4 w-4 text-red-600 mr-1" />
      )}
      {value ? 'Yes' : 'No'}
    </span>
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map(col => col.checked && (
            <TableHead key={col.id}>
              {col.id === 'foundedDate' ? (
                <div className="flex items-center">
                  <CalendarClock className="h-4 w-4 mr-2" />
                  {col.label}
                </div>
              ) : col.id === 'annualFees' ? (
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  {col.label}
                </div>
              ) : col.id === 'location' || col.id === 'city' ? (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {col.label}
                </div>
              ) : col.id === 'county' ? (
                <div className="flex items-center">
                  <MapPinned className="h-4 w-4 mr-2" />
                  {col.label}
                </div>
              ) : col.id === 'offsiteAddresses' ? (
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2" />
                  {col.label}
                </div>
              ) : col.id === 'leases' ? (
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  {col.label}
                </div>
              ) : col.id === 'serviceType' ? (
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2" />
                  {col.label}
                </div>
              ) : col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {properties.map((property, i) => (
          <TableRow key={i} className="cursor-pointer hover:bg-muted">
            {columns.map(col => col.checked && (
              <TableCell key={col.id}>
                {col.id === 'name' ? (
                  <span className="font-medium">{property.name}</span>
                ) : col.id === 'status' ? (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    property.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {property.status}
                  </span>
                ) : col.id === 'foundedDate' ? (
                  new Date(property.foundedDate).toLocaleDateString()
                ) : typeof property[col.id as keyof typeof property] === 'boolean' ? (
                  renderBooleanValue(property[col.id as keyof typeof property] as boolean)
                ) : (
                  property[col.id as keyof typeof property]
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PropertyTable;
