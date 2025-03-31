
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

const mockVendorData = [
  {
    id: '1',
    name: 'ABC Landscaping Services',
    contactName: 'Michael Brown',
    email: 'michael@abclandscaping.com',
    phone: '(555) 123-4567',
    category: 'Landscaping',
    status: 'active',
    lastInvoice: '2023-06-15',
    rating: 4.8
  },
  {
    id: '2',
    name: 'QuickFix Plumbing',
    contactName: 'Sarah Johnson',
    email: 'sarah@quickfixplumbing.com',
    phone: '(555) 987-6543',
    category: 'Plumbing',
    status: 'active',
    lastInvoice: '2023-05-22',
    rating: 4.5
  },
  {
    id: '3',
    name: 'Elite Security Systems',
    contactName: 'David Wilson',
    email: 'david@elitesecurity.com',
    phone: '(555) 456-7890',
    category: 'Security',
    status: 'inactive',
    lastInvoice: '2022-11-05',
    rating: 3.9
  }
];

const VendorRecords: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const filteredData = mockVendorData.filter(vendor => {
    // Filter by search term
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter;
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddVendor = () => {
    toast.info("Add vendor functionality would open a form");
  };

  const handleViewDetails = (id: string) => {
    toast.info(`Viewing details for vendor ${id}`);
  };

  const handleEdit = (id: string) => {
    toast.info(`Editing vendor ${id}`);
  };

  const handleDelete = (id: string) => {
    toast.info(`Deleting vendor ${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1 flex gap-2">
          <Input 
            placeholder="Search vendors..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Landscaping">Landscaping</SelectItem>
              <SelectItem value="Plumbing">Plumbing</SelectItem>
              <SelectItem value="Security">Security</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
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
        </div>
        <Button onClick={handleAddVendor} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      <Card>
        <CardHeader className="py-4">
          <CardTitle>Vendor Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox />
                </TableHead>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>{vendor.contactName}</TableCell>
                  <TableCell>{vendor.category}</TableCell>
                  <TableCell>{vendor.email}</TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      vendor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {vendor.status}
                    </div>
                  </TableCell>
                  <TableCell>{vendor.rating} / 5</TableCell>
                  <TableCell className="text-right space-x-1">
                    <TooltipButton tooltipText="View Details" variant="ghost" size="icon" onClick={() => handleViewDetails(vendor.id)}>
                      <Eye className="h-4 w-4" />
                    </TooltipButton>
                    <TooltipButton tooltipText="Edit" variant="ghost" size="icon" onClick={() => handleEdit(vendor.id)}>
                      <Edit className="h-4 w-4" />
                    </TooltipButton>
                    <TooltipButton tooltipText="Delete" variant="ghost" size="icon" onClick={() => handleDelete(vendor.id)}>
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

export default VendorRecords;
