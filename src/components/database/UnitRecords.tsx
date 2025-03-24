
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const UnitRecords = () => {
  return (
    <div className="pt-4">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search units..."
            className="pl-8"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Unit Number</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Sq Ft</TableHead>
            <TableHead>Bedrooms</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            { id: 'U001', unit: '101', property: 'Oakwood Heights', sqft: '850', bedrooms: '1', status: 'Occupied' },
            { id: 'U002', unit: '205', property: 'Oakwood Heights', sqft: '1200', bedrooms: '2', status: 'Occupied' },
            { id: 'U003', unit: '14', property: 'Willow Creek Estates', sqft: '1800', bedrooms: '3', status: 'Occupied' },
            { id: 'U004', unit: '301', property: 'Riverfront Towers', sqft: '1100', bedrooms: '2', status: 'Vacant' },
            { id: 'U005', unit: '7', property: 'Pine Valley Community', sqft: '2200', bedrooms: '4', status: 'Occupied' },
          ].map((unit, i) => (
            <TableRow key={i}>
              <TableCell className="font-mono">{unit.id}</TableCell>
              <TableCell className="font-medium">{unit.unit}</TableCell>
              <TableCell>{unit.property}</TableCell>
              <TableCell>{unit.sqft}</TableCell>
              <TableCell>{unit.bedrooms}</TableCell>
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
  );
};

export default UnitRecords;
