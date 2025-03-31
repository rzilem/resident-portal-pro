
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Mail, Phone, Edit, Trash2, Eye, FileText } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

// Mock data for vendors
const mockVendors = [
  {
    id: "1",
    name: "ABC Plumbing Services",
    contactName: "Robert Johnson",
    email: "info@abcplumbing.com",
    phone: "(555) 123-7890",
    category: "Plumbing",
    status: "active",
    contractExpiry: "2023-12-31",
  },
  {
    id: "2",
    name: "Elite Landscaping Co.",
    contactName: "Maria Garcia",
    email: "maria@elitelandscaping.com",
    phone: "(555) 456-7890",
    category: "Landscaping",
    status: "active",
    contractExpiry: "2024-05-15",
  },
  {
    id: "3",
    name: "Quick Fix Electricians",
    contactName: "James Wilson",
    email: "service@quickfixelec.com",
    phone: "(555) 789-1234",
    category: "Electrical",
    status: "inactive",
    contractExpiry: "2023-08-20",
  },
  {
    id: "4",
    name: "Secure Lock & Key",
    contactName: "Diana Lee",
    email: "diana@securelock.com",
    phone: "(555) 321-6547",
    category: "Security",
    status: "active",
    contractExpiry: "2024-02-28",
  },
  {
    id: "5",
    name: "Fresh Paint Pro",
    contactName: "Thomas Brown",
    email: "thomas@freshpaint.com",
    phone: "(555) 987-3214",
    category: "Painting",
    status: "pending",
    contractExpiry: "2023-11-10",
  }
];

const VendorRecords: React.FC = () => {
  const [vendors] = useState(mockVendors);

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

  const handleViewDetails = (vendorId: string) => {
    toast.info(`Viewing details for vendor ${vendorId}`);
  };

  const handleViewContract = (vendorId: string) => {
    toast.info(`Viewing contract for vendor ${vendorId}`);
  };

  const handleSendEmail = (email: string) => {
    toast.info(`Sending email to ${email}`);
  };

  const handleCall = (phone: string) => {
    toast.info(`Calling ${phone}`);
  };

  const handleEdit = (vendorId: string) => {
    toast.info(`Editing vendor ${vendorId}`);
  };

  const handleDelete = (vendorId: string) => {
    toast.info(`Deleting vendor ${vendorId}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Vendors</h2>
        <Button size="sm">Add Vendor</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Contract Expiry</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{vendor.name}</div>
                    <div className="text-sm text-muted-foreground">{vendor.contactName}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center">
                      <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <span className="text-sm">{vendor.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <span className="text-sm">{vendor.phone}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{vendor.category}</TableCell>
                <TableCell>{new Date(vendor.contractExpiry).toLocaleDateString()}</TableCell>
                <TableCell>{getStatusBadge(vendor.status)}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleViewDetails(vendor.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewContract(vendor.id)}>
                        <FileText className="mr-2 h-4 w-4" />
                        View Contract
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSendEmail(vendor.email)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCall(vendor.phone)}>
                        <Phone className="mr-2 h-4 w-4" />
                        Call
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEdit(vendor.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(vendor.id)}
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

export default VendorRecords;
