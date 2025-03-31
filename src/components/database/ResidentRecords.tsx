
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Mail, Phone, Edit, Trash2, Eye } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

// Mock data for residents
const mockResidents = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Unit 101",
    propertyId: "prop-101",
    status: "active",
    moveinDate: "2021-05-15",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "(555) 987-6543",
    address: "456 Oak Ave, Unit 202",
    propertyId: "prop-202",
    status: "active",
    moveinDate: "2020-11-03",
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    email: "mrodriguez@example.com",
    phone: "(555) 333-2222",
    address: "789 Pine Dr, Unit 303",
    propertyId: "prop-303",
    status: "inactive",
    moveinDate: "2019-07-22",
  },
  {
    id: "4",
    name: "Emily Chen",
    email: "emily.c@example.com",
    phone: "(555) 444-5555",
    address: "321 Cedar Ln, Unit 404",
    propertyId: "prop-404",
    status: "pending",
    moveinDate: "2022-01-10",
  },
  {
    id: "5",
    name: "David Williams",
    email: "dwilliams@example.com",
    phone: "(555) 777-8888",
    address: "654 Maple Rd, Unit 505",
    propertyId: "prop-505",
    status: "active",
    moveinDate: "2021-03-15",
  }
];

const ResidentRecords: React.FC = () => {
  const [residents] = useState(mockResidents);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleViewDetails = (residentId: string) => {
    toast.info(`Viewing details for resident ${residentId}`);
  };

  const handleSendEmail = (email: string) => {
    toast.info(`Sending email to ${email}`);
  };

  const handleCall = (phone: string) => {
    toast.info(`Calling ${phone}`);
  };

  const handleEdit = (residentId: string) => {
    toast.info(`Editing resident ${residentId}`);
  };

  const handleDelete = (residentId: string) => {
    toast.info(`Deleting resident ${residentId}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Residents</h2>
        <Button size="sm">Add Resident</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Move-in Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {residents.map((resident) => (
              <TableRow key={resident.id}>
                <TableCell className="font-medium">{resident.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center">
                      <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <span className="text-sm">{resident.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <span className="text-sm">{resident.phone}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{resident.address}</TableCell>
                <TableCell>{new Date(resident.moveinDate).toLocaleDateString()}</TableCell>
                <TableCell>{getStatusBadge(resident.status)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleViewDetails(resident.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSendEmail(resident.email)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCall(resident.phone)}>
                        <Phone className="mr-2 h-4 w-4" />
                        Call
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEdit(resident.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(resident.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ResidentRecords;
