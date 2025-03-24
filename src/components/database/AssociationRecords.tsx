
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, Filter, Search, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

// Define type for homeowner data
type Homeowner = {
  id: string;
  fullName: string;
  unit: string;
  address: string;
  property: string;
  phone: string;
  email: string;
  status: string;
  moveInDate: string;
  moveOutDate?: string;
  balance: string;
  lastPaymentDate: string;
  lastPaymentAmount: string;
  paymentMethod: string;
  ownerType: string;
  primaryResidence: string;
  mailingAddress: string;
  notes?: string;
};

const AssociationRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof Homeowner>('fullName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Mock data based on the image
  const homeowners: Homeowner[] = [
    {
      id: "H001",
      fullName: "Alice Johnson",
      unit: "101",
      address: "123 Main Street",
      property: "Oakwood Heights",
      phone: "(555) 123-4567",
      email: "alice.j@example.com",
      status: "Active",
      moveInDate: "12/05/2019",
      balance: "$0.00",
      lastPaymentDate: "01/15/2023",
      lastPaymentAmount: "$350.00",
      paymentMethod: "Auto-draft",
      ownerType: "Owner",
      primaryResidence: "Yes",
      mailingAddress: "Same as unit",
    },
    {
      id: "H002",
      fullName: "Robert Smith",
      unit: "142",
      address: "456 Park Avenue",
      property: "Willow Creek Estates",
      phone: "(555) 234-5678",
      email: "robert.s@example.com",
      status: "Active",
      moveInDate: "03/15/2020",
      moveOutDate: "06/30/2023",
      balance: "$75.00",
      lastPaymentDate: "05/10/2023",
      lastPaymentAmount: "$175.00",
      paymentMethod: "Check",
      ownerType: "Tenant",
      primaryResidence: "No",
      mailingAddress: "789 Oak St, Portland, OR",
    },
    {
      id: "H003",
      fullName: "Emily Davis",
      unit: "506",
      address: "789 River Road",
      property: "Riverfront Towers",
      phone: "(555) 345-6789",
      email: "emily.d@example.com",
      status: "Inactive",
      moveInDate: "07/01/2018",
      moveOutDate: "02/28/2023",
      balance: "$0.00",
      lastPaymentDate: "02/15/2023",
      lastPaymentAmount: "$425.00",
      paymentMethod: "Auto-draft",
      ownerType: "Owner",
      primaryResidence: "Yes",
      mailingAddress: "Same as unit",
    },
    {
      id: "H004",
      fullName: "Michael Wilson",
      unit: "203",
      address: "321 Sunset Blvd",
      property: "Sunset Gardens",
      phone: "(555) 456-7890",
      email: "michael.w@example.com",
      status: "Pending",
      moveInDate: "09/15/2021",
      balance: "$150.00",
      lastPaymentDate: "04/30/2023",
      lastPaymentAmount: "$200.00",
      paymentMethod: "Credit Card",
      ownerType: "Owner",
      primaryResidence: "Yes",
      mailingAddress: "Same as unit",
    },
    {
      id: "H005",
      fullName: "Sarah Brown",
      unit: "118",
      address: "654 Pine Valley Rd",
      property: "Pine Valley Community",
      phone: "(555) 567-8901",
      email: "sarah.b@example.com",
      status: "Active",
      moveInDate: "11/01/2019",
      balance: "$25.00",
      lastPaymentDate: "05/01/2023",
      lastPaymentAmount: "$300.00",
      paymentMethod: "Auto-draft",
      ownerType: "Tenant",
      primaryResidence: "Yes",
      mailingAddress: "Same as unit",
    },
    {
      id: "H006",
      fullName: "David Miller",
      unit: "224",
      address: "987 Oak Street",
      property: "Oakwood Heights",
      phone: "(555) 678-9012",
      email: "david.m@example.com",
      status: "Inactive",
      moveInDate: "05/15/2020",
      moveOutDate: "04/30/2023",
      balance: "$0.00",
      lastPaymentDate: "04/15/2023",
      lastPaymentAmount: "$275.00",
      paymentMethod: "Check",
      ownerType: "Owner",
      primaryResidence: "No",
      mailingAddress: "123 Maple St, Denver, CO",
    },
  ];

  // Filter homeowners based on search term
  const filteredHomeowners = homeowners.filter(homeowner =>
    Object.values(homeowner).some(value => 
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort homeowners based on selected column and direction
  const sortedHomeowners = [...filteredHomeowners].sort((a, b) => {
    const aValue = a[sortColumn]?.toString() || '';
    const bValue = b[sortColumn]?.toString() || '';
    
    return sortDirection === 'asc' 
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  // Handle sorting when clicking a table header
  const handleSort = (column: keyof Homeowner) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Get appropriate badge variant based on status
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Inactive':
        return 'outline';
      case 'Pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Association Records</CardTitle>
        <CardDescription>
          View and manage all homeowner records within the association
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search homeowners..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50" 
                  onClick={() => handleSort('id')}
                >
                  ID {sortColumn === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50" 
                  onClick={() => handleSort('fullName')}
                >
                  Name {sortColumn === 'fullName' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Move-In Date</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Last Payment</TableHead>
                <TableHead>Owner Type</TableHead>
                <TableHead>Primary Residence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedHomeowners.length > 0 ? (
                sortedHomeowners.map((homeowner) => (
                  <TableRow key={homeowner.id}>
                    <TableCell className="font-mono">{homeowner.id}</TableCell>
                    <TableCell className="font-medium">
                      <Link 
                        to={`/residents/${homeowner.id}`} 
                        className="text-primary hover:underline hover:text-primary/80 transition-colors"
                      >
                        {homeowner.fullName}
                      </Link>
                    </TableCell>
                    <TableCell>{homeowner.unit}</TableCell>
                    <TableCell>
                      <Link 
                        to={`/properties?filter=${encodeURIComponent(homeowner.property)}`}
                        className="hover:underline hover:text-primary/80 transition-colors"
                      >
                        {homeowner.property}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <a 
                          href={`mailto:${homeowner.email}`}
                          className="text-sm hover:underline hover:text-primary/80 transition-colors"
                        >
                          {homeowner.email}
                        </a>
                        <span className="text-xs text-muted-foreground">{homeowner.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(homeowner.status)}>
                        {homeowner.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{homeowner.moveInDate}</span>
                        {homeowner.moveOutDate && (
                          <span className="text-xs text-muted-foreground">
                            to {homeowner.moveOutDate}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{homeowner.balance}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{homeowner.lastPaymentAmount}</span>
                        <span className="text-xs text-muted-foreground">
                          {homeowner.lastPaymentDate} ({homeowner.paymentMethod})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{homeowner.ownerType}</TableCell>
                    <TableCell>{homeowner.primaryResidence}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} className="h-24 text-center">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="text-xs text-muted-foreground mt-4">
          Showing {sortedHomeowners.length} of {homeowners.length} homeowners
        </div>
      </CardContent>
    </Card>
  );
};

export default AssociationRecords;
