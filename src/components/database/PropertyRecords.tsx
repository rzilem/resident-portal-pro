
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash, Download, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockProperties = [
  {
    id: 'P001',
    address: '123 Main Street',
    unitNumber: '101',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    type: 'Condo',
    association: 'Oakwood Heights',
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    status: 'Occupied'
  },
  {
    id: 'P002',
    address: '456 Park Avenue',
    unitNumber: '201',
    city: 'Austin',
    state: 'TX',
    zip: '78702',
    type: 'Townhouse',
    association: 'Willow Creek Estates',
    bedrooms: 3,
    bathrooms: 2.5,
    squareFeet: 1800,
    status: 'Vacant'
  },
  {
    id: 'P003',
    address: '789 River Road',
    unitNumber: '301',
    city: 'Austin',
    state: 'TX',
    zip: '78703',
    type: 'Single Family',
    association: 'Riverfront Towers',
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2500,
    status: 'Occupied'
  },
  {
    id: 'P004',
    address: '101 Lake View',
    unitNumber: '',
    city: 'Austin',
    state: 'TX',
    zip: '78704',
    type: 'Single Family',
    association: 'Lakeside Community',
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 3200,
    status: 'Occupied'
  },
  {
    id: 'P005',
    address: '202 Mountain Trail',
    unitNumber: '105',
    city: 'Austin',
    state: 'TX',
    zip: '78705',
    type: 'Condo',
    association: 'Mountain View HOA',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 800,
    status: 'Vacant'
  }
];

const PropertyRecords = () => {
  const [view, setView] = useState<'table' | 'card'>('table');
  
  const handleExport = () => {
    toast.success('Exporting property records');
  };

  const handleViewDetails = (id: string) => {
    toast.info(`Viewing property details for ${id}`);
  };

  const handleEdit = (id: string) => {
    toast.info(`Editing property ${id}`);
  };

  const handleDelete = (id: string) => {
    toast.info(`Deleting property ${id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Occupied':
        return 'bg-green-100 text-green-800';
      case 'Vacant':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {view === 'table' ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Association</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">{property.id}</TableCell>
                  <TableCell>
                    {property.address}
                    {property.unitNumber && `, Unit ${property.unitNumber}`}
                    <div className="text-xs text-muted-foreground">
                      {property.city}, {property.state} {property.zip}
                    </div>
                  </TableCell>
                  <TableCell>{property.type}</TableCell>
                  <TableCell>{property.association}</TableCell>
                  <TableCell>
                    {property.squareFeet} sq ft
                    <div className="text-xs text-muted-foreground">
                      {property.bedrooms} bd, {property.bathrooms} ba
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(property.status)}>
                      {property.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(property.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(property.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(property.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExport()}>
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(property.id)}
                            className="text-red-600"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockProperties.map((property) => (
            <Card key={property.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{property.address}</h3>
                    <p className="text-sm text-muted-foreground">
                      {property.unitNumber && `Unit ${property.unitNumber}, `}
                      {property.city}, {property.state} {property.zip}
                    </p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(property.status)}>
                    {property.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Property Type</p>
                    <p className="text-sm">{property.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Association</p>
                    <p className="text-sm">{property.association}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Size</p>
                    <p className="text-sm">{property.squareFeet} sq ft</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Layout</p>
                    <p className="text-sm">{property.bedrooms} bd, {property.bathrooms} ba</p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="ghost" size="sm" onClick={() => handleViewDetails(property.id)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(property.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(property.id)} className="text-red-600">
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyRecords;
