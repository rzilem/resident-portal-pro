
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DatabaseColumnsSelector, DatabaseColumn } from './DatabaseColumnsSelector';
import { useSettings } from '@/hooks/use-settings';

const PropertyRecords = () => {
  const { preferences } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Define default columns
  const defaultColumns: DatabaseColumn[] = [
    { id: 'id', label: 'ID', checked: true },
    { id: 'name', label: 'Property Name', checked: true },
    { id: 'type', label: 'Type', checked: true },
    { id: 'units', label: 'Units', checked: true },
    { id: 'location', label: 'Location', checked: true },
    { id: 'created', label: 'Created Date', checked: true },
  ];
  
  // Initialize columns from preferences or defaults
  const [columns, setColumns] = useState<DatabaseColumn[]>(
    preferences?.databasePropertyColumns || defaultColumns
  );
  
  // Update columns when preferences change
  useEffect(() => {
    if (preferences?.databasePropertyColumns) {
      setColumns(preferences.databasePropertyColumns);
    }
  }, [preferences]);
  
  const handleColumnsChange = (newColumns: DatabaseColumn[]) => {
    setColumns(newColumns);
  };
  
  // Sample property data
  const properties = [
    { id: 'P001', name: 'Oakwood Heights', type: 'Condominium', units: '48', location: 'Seattle, WA', created: '2021-05-14' },
    { id: 'P002', name: 'Willow Creek Estates', type: 'HOA', units: '86', location: 'Portland, OR', created: '2018-09-22' },
    { id: 'P003', name: 'Riverfront Towers', type: 'Condominium', units: '64', location: 'Denver, CO', created: '2020-03-15' },
    { id: 'P004', name: 'Sunset Gardens', type: 'HOA', units: '32', location: 'San Diego, CA', created: '2019-07-08' },
    { id: 'P005', name: 'Pine Valley Community', type: 'HOA', units: '26', location: 'Austin, TX', created: '2021-11-29' },
  ];

  return (
    <div className="pt-4">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search properties..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DatabaseColumnsSelector 
            columns={columns}
            onChange={handleColumnsChange}
            type="property"
          />
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(col => col.checked && (
              <TableHead key={col.id}>{col.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property, i) => (
            <TableRow key={i}>
              {columns.map(col => col.checked && (
                <TableCell key={col.id}>
                  {col.id === 'id' ? (
                    <span className="font-mono">{property[col.id as keyof typeof property]}</span>
                  ) : col.id === 'name' ? (
                    <span className="font-medium">{property[col.id as keyof typeof property]}</span>
                  ) : (
                    property[col.id as keyof typeof property]
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PropertyRecords;
