
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const PropertyRecords = () => {
  return (
    <div className="pt-4">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search properties..."
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
            <TableHead>Property Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Units</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Created Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            { id: 'P001', name: 'Oakwood Heights', type: 'Condominium', units: '48', location: 'Seattle, WA', created: '2021-05-14' },
            { id: 'P002', name: 'Willow Creek Estates', type: 'HOA', units: '86', location: 'Portland, OR', created: '2018-09-22' },
            { id: 'P003', name: 'Riverfront Towers', type: 'Condominium', units: '64', location: 'Denver, CO', created: '2020-03-15' },
            { id: 'P004', name: 'Sunset Gardens', type: 'HOA', units: '32', location: 'San Diego, CA', created: '2019-07-08' },
            { id: 'P005', name: 'Pine Valley Community', type: 'HOA', units: '26', location: 'Austin, TX', created: '2021-11-29' },
          ].map((property, i) => (
            <TableRow key={i}>
              <TableCell className="font-mono">{property.id}</TableCell>
              <TableCell className="font-medium">{property.name}</TableCell>
              <TableCell>{property.type}</TableCell>
              <TableCell>{property.units}</TableCell>
              <TableCell>{property.location}</TableCell>
              <TableCell>{property.created}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PropertyRecords;
