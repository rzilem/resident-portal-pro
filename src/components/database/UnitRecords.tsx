
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Download, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { DatabaseColumnsSelector, DatabaseColumn } from './DatabaseColumnsSelector';
import { useSettings } from '@/hooks/use-settings';

const UnitRecords = () => {
  const isMobile = useIsMobile();
  const { preferences } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('unit');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const defaultColumns: DatabaseColumn[] = [
    { id: 'id', label: 'ID', checked: true },
    { id: 'unit', label: 'Unit Number', checked: true },
    { id: 'property', label: 'Property', checked: true },
    { id: 'sqft', label: 'Sq Ft', checked: true },
    { id: 'bedrooms', label: 'Bedrooms', checked: true },
    { id: 'taxDistrict', label: 'Tax District', checked: true },
    { id: 'taxId', label: 'Tax ID', checked: true },
    { id: 'status', label: 'Status', checked: true },
  ];
  
  const [columns, setColumns] = useState<DatabaseColumn[]>(
    preferences?.databaseUnitColumns || defaultColumns
  );
  
  useEffect(() => {
    if (preferences?.databaseUnitColumns) {
      setColumns(preferences.databaseUnitColumns);
    }
  }, [preferences]);
  
  const handleColumnsChange = (newColumns: DatabaseColumn[]) => {
    setColumns(newColumns);
  };

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
  
  const units = [
    { 
      id: 'U001', 
      unit: '101', 
      property: 'Oakwood Heights', 
      sqft: '850', 
      bedrooms: '1', 
      status: 'Occupied',
      taxDistrict: 'North Seattle', 
      taxId: 'TX-10145-A' 
    },
    { 
      id: 'U002', 
      unit: '205', 
      property: 'Oakwood Heights', 
      sqft: '1200', 
      bedrooms: '2', 
      status: 'Occupied',
      taxDistrict: 'North Seattle', 
      taxId: 'TX-10146-B' 
    },
    { 
      id: 'U003', 
      unit: '14', 
      property: 'Willow Creek Estates', 
      sqft: '1800', 
      bedrooms: '3', 
      status: 'Occupied',
      taxDistrict: 'Portland Metro', 
      taxId: 'PDX-2367' 
    },
    { 
      id: 'U004', 
      unit: '301', 
      property: 'Riverfront Towers', 
      sqft: '1100', 
      bedrooms: '2', 
      status: 'Vacant',
      taxDistrict: 'Downtown Denver', 
      taxId: 'DEN-7701' 
    },
    { 
      id: 'U005', 
      unit: '7', 
      property: 'Pine Valley Community', 
      sqft: '2200', 
      bedrooms: '4', 
      status: 'Occupied',
      taxDistrict: 'Austin City', 
      taxId: 'AUS-9954-XC' 
    },
  ];

  // Filter units based on search
  const filteredUnits = searchTerm
    ? units.filter(unit => 
        Object.values(unit).some(value => 
          value && String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : units;

  // Sort units based on current sort field and direction
  const sortedUnits = [...filteredUnits].sort((a, b) => {
    const valueA = a[sortField as keyof typeof a];
    const valueB = b[sortField as keyof typeof b];
    
    // Special handling for numeric fields
    if (sortField === 'sqft' || sortField === 'bedrooms') {
      const numA = parseInt(String(valueA), 10) || 0;
      const numB = parseInt(String(valueB), 10) || 0;
      return sortDirection === 'asc' ? numA - numB : numB - numA;
    } 
    // Special handling for unit numbers (could be alphanumeric)
    else if (sortField === 'unit') {
      // Try to parse as numbers first, fall back to string comparison
      const numA = parseInt(String(valueA), 10);
      const numB = parseInt(String(valueB), 10);
      
      if (!isNaN(numA) && !isNaN(numB)) {
        return sortDirection === 'asc' ? numA - numB : numB - numA;
      }
    }
    
    // Default string comparison
    const strA = String(valueA).toLowerCase();
    const strB = String(valueB).toLowerCase();
    
    return sortDirection === 'asc' 
      ? strA.localeCompare(strB)
      : strB.localeCompare(strA);
  });

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };
  
  return (
    <div className="pt-4">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search units..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DatabaseColumnsSelector 
            columns={columns}
            onChange={handleColumnsChange}
            type="unit"
          />
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>
      
      {isMobile && (
        <div className="space-y-3 md:hidden">
          {sortedUnits.map((unit, i) => (
            <Card key={i} className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-mono text-sm">{unit.id}</span>
                  <h3 className="font-semibold">Unit {unit.unit}</h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  unit.status === 'Occupied' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {unit.status}
                </span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property:</span>
                  <span>{unit.property}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size:</span>
                  <span>{unit.sqft} sq ft, {unit.bedrooms} BR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax District:</span>
                  <span>{unit.taxDistrict}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax ID:</span>
                  <span className="font-mono">{unit.taxId}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-3 justify-between">
                View Details <ChevronRight className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}
      
      <div className="hidden md:block overflow-auto">
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
                    {col.label}
                    <SortIcon field={col.id} />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUnits.map((unit, i) => (
              <TableRow key={i}>
                {columns.map(col => col.checked && (
                  <TableCell key={col.id}>
                    {col.id === 'id' ? (
                      <span className="font-mono">{unit[col.id as keyof typeof unit]}</span>
                    ) : col.id === 'unit' ? (
                      <span className="font-medium">{unit[col.id as keyof typeof unit]}</span>
                    ) : col.id === 'status' ? (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        unit.status === 'Occupied' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {unit.status}
                      </span>
                    ) : (
                      unit[col.id as keyof typeof unit]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UnitRecords;
