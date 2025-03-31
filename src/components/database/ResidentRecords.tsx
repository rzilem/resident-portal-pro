
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, UserPlus, Eye } from 'lucide-react';
import { TooltipButton } from '@/components/ui/tooltip-button';
import { toast } from 'sonner';

const mockResidentData = [
  {
    id: '1',
    name: 'John Smith',
    unit: 'A-101',
    property: 'Oakwood Heights',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    status: 'active',
    moveInDate: '2021-05-15',
    balance: '$0.00'
  },
  {
    id: '2',
    name: 'Maria Garcia',
    unit: 'B-205',
    property: 'Oakwood Heights',
    email: 'maria.garcia@example.com',
    phone: '(555) 987-6543',
    status: 'active',
    moveInDate: '2022-01-10',
    balance: '$250.00'
  },
  {
    id: '3',
    name: 'Robert Johnson',
    unit: 'C-310',
    property: 'Willow Creek Estates',
    email: 'robert.j@example.com',
    phone: '(555) 456-7890',
    status: 'inactive',
    moveInDate: '2020-08-22',
    moveOutDate: '2023-02-28',
    balance: '$0.00'
  }
];

const ResidentRecords: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');
  
  const filteredData = mockResidentData.filter(resident => {
    // Filter by search term
    const matchesSearch = resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resident.unit.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || resident.status === statusFilter;
    
    // Filter by property
    const matchesProperty = propertyFilter === 'all' || resident.property === propertyFilter;
    
    return matchesSearch && matchesStatus && matchesProperty;
  });

  const handleAddResident = () => {
    toast.info("Add resident functionality would open a form");
  };

  const handleViewDetails = (id: string) => {
    toast.info(`Viewing details for resident ${id}`);
  };

  const handleEdit = (id: string) => {
    toast.info(`Editing resident ${id}`);
  };

  const handleDelete = (id: string) => {
    toast.info(`Deleting resident ${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1 flex gap-2">
          <Input 
            placeholder="Search residents..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={propertyFilter} onValueChange={setPropertyFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="Oakwood Heights">Oakwood Heights</SelectItem>
              <SelectItem value="Willow Creek Estates">Willow Creek Estates</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAddResident} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Resident
        </Button>
      </div>

      <Card>
        <CardHeader className="py-4">
          <CardTitle>Resident Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((resident) => (
                <TableRow key={resident.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="font-medium">{resident.name}</TableCell>
                  <TableCell>{resident.unit}</TableCell>
                  <TableCell>{resident.property}</TableCell>
                  <TableCell>{resident.email}</TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      resident.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {resident.status}
                    </div>
                  </TableCell>
                  <TableCell>{resident.balance}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <TooltipButton tooltipText="View Details" variant="ghost" size="icon" onClick={() => handleViewDetails(resident.id)}>
                      <Eye className="h-4 w-4" />
                    </TooltipButton>
                    <TooltipButton tooltipText="Edit" variant="ghost" size="icon" onClick={() => handleEdit(resident.id)}>
                      <Edit className="h-4 w-4" />
                    </TooltipButton>
                    <TooltipButton tooltipText="Delete" variant="ghost" size="icon" onClick={() => handleDelete(resident.id)}>
                      <Trash2 className="h-4 w-4" />
                    </TooltipButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResidentRecords;
