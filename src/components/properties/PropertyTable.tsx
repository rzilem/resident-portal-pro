
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, CalendarClock, DollarSign, MapPin, MapPinned, Building2, FileText, Briefcase, ChevronUp, ChevronDown } from 'lucide-react';
import { PropertyColumn } from './PropertyColumnsSelector';
import { Property } from './PropertyHelpers';

interface PropertyTableProps {
  properties: Property[];
  columns: PropertyColumn[];
}

const PropertyTable = ({ properties, columns }: PropertyTableProps) => {
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if same field clicked
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedProperties = [...properties].sort((a, b) => {
    // Handle properties that might not have the sort field
    const valueA = a[sortField as keyof Property];
    const valueB = b[sortField as keyof Property];
    
    // Return early if either value is undefined
    if (valueA === undefined || valueB === undefined) return 0;
    
    // Handle different data types
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    } else if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
      return sortDirection === 'asc' 
        ? (valueA === valueB ? 0 : valueA ? -1 : 1)
        : (valueA === valueB ? 0 : valueA ? 1 : -1);
    } else if (valueA instanceof Date && valueB instanceof Date) {
      return sortDirection === 'asc' 
        ? valueA.getTime() - valueB.getTime() 
        : valueB.getTime() - valueA.getTime();
    } else {
      // Convert to string for comparison
      const strA = String(valueA).toLowerCase();
      const strB = String(valueB).toLowerCase();
      
      return sortDirection === 'asc' 
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    }
  });

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

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
            <TableHead 
              key={col.id}
              className="cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => handleSort(col.id)}
            >
              <div className="flex items-center gap-1">
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
                <SortIcon field={col.id} />
              </div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedProperties.map((property, i) => (
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
