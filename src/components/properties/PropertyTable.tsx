
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, CalendarClock, DollarSign, MapPin, MapPinned, Building2, FileText, Briefcase, ChevronUp, ChevronDown, CalendarDays } from 'lucide-react';
import { PropertyColumn } from './PropertyColumnsSelector';
import { Property } from './PropertyHelpers';

interface PropertyTableProps {
  properties: Property[];
  columns: PropertyColumn[];
}

const PropertyTable = ({ properties, columns }: PropertyTableProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const navigateToAssociation = (associationId: string) => {
    // Only navigate if we're not already on this property's page
    if (id !== associationId) {
      navigate(`/properties/${associationId}`);
    }
  };

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
              {col.id === 'foundedDate' ? (
                <div className="flex items-center">
                  <CalendarClock className="h-4 w-4 mr-2" />
                  Onboarding Date
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
              ) : col.id === 'assessmentFrequency' ? (
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  {col.label}
                </div>
              ) : col.label}
              <SortIcon field={col.id} />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {properties.map((property, i) => (
          <TableRow key={i} className="hover:bg-muted">
            {columns.map(col => col.checked && (
              <TableCell key={col.id}>
                {col.id === 'name' ? (
                  <button 
                    onClick={() => navigateToAssociation(property.associationId || 'unknown')}
                    className="font-medium text-primary hover:underline text-left cursor-pointer"
                  >
                    {property.name}
                  </button>
                ) : col.id === 'status' ? (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    property.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {property.status}
                  </span>
                ) : col.id === 'foundedDate' ? (
                  new Date(property.onboardingDate).toLocaleDateString()
                ) : col.id === 'assessmentFrequency' ? (
                  <span className="flex items-center">
                    <CalendarDays className="h-4 w-4 text-blue-600 mr-1" />
                    {property.assessmentFrequency}
                  </span>
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
