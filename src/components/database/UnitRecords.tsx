
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Download, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

const UnitRecords = () => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  
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
      
      {/* Mobile view */}
      {isMobile && (
        <div className="space-y-3 md:hidden">
          {units.map((unit, i) => (
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
      
      {/* Desktop view */}
      <div className="hidden md:block overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Unit Number</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Sq Ft</TableHead>
              <TableHead>Bedrooms</TableHead>
              <TableHead>Tax District</TableHead>
              <TableHead>Tax ID</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.map((unit, i) => (
              <TableRow key={i}>
                <TableCell className="font-mono">{unit.id}</TableCell>
                <TableCell className="font-medium">{unit.unit}</TableCell>
                <TableCell>{unit.property}</TableCell>
                <TableCell>{unit.sqft}</TableCell>
                <TableCell>{unit.bedrooms}</TableCell>
                <TableCell>{unit.taxDistrict}</TableCell>
                <TableCell className="font-mono">{unit.taxId}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    unit.status === 'Occupied' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {unit.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UnitRecords;
