
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TooltipButton } from '@/components/ui/tooltip-button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, Download, RefreshCw, Check, ClipboardList, Filter, Search, Package, Eye, 
  FileText, FileCheck, FilePen, FileX 
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { generateResaleCertificate } from '@/utils/pdfGenerator';

// Mock data
const orders = [
  { 
    id: 'MOH-402879', 
    address: '4508 Duval Road Unit 1-101, Austin, TX 78727', 
    ownerSeller: 'Rebecca Johnson', 
    accountNum: 'SH42581', 
    community: 'Stonehaven Condos', 
    package: 'R MQ', 
    scheduled: '04/01/25', 
    status: 'Scheduled', 
    settlement: '', 
    submitted: '03/25/25',
    type: 'Mortgage Questionnaire',
    priority: 'Regular'
  },
  { 
    id: 'MOH-402855', 
    address: '175 Caspian Ln, Driftwood, TX 78619', 
    ownerSeller: 'Viktor & Maria Cizmarik', 
    accountNum: 'LVR48984', 
    community: 'La Ventana Ranch', 
    package: 'S TRECPO', 
    scheduled: '04/01/25', 
    status: 'Scheduled', 
    settlement: '05/15/25', 
    submitted: '03/18/25',
    type: 'Resale Certificate',
    priority: 'Standard'
  },
  { 
    id: 'MOH-402899', 
    address: '107 Sunrise Ridge Cv Unit 1603, Austin, TX 78738', 
    ownerSeller: 'James Wilson', 
    accountNum: 'EAV45133', 
    community: 'Enclave at Alta Vista', 
    package: 'Exp LL QB', 
    scheduled: '04/01/25', 
    status: 'In Review', 
    settlement: '', 
    submitted: '03/28/25',
    type: 'Questionnaire',
    priority: 'Expedited'
  },
  { 
    id: 'MOH-402881', 
    address: '206 Newport Landing Pl, Round Rock, TX 78665', 
    ownerSeller: 'Kathleen Moore', 
    accountNum: 'CCH21264', 
    community: 'Chandler Creek HOA', 
    package: 'R TRECPO', 
    scheduled: '04/01/25', 
    status: 'Completed', 
    settlement: '04/24/25', 
    submitted: '03/25/25',
    type: 'Resale Certificate',
    priority: 'Regular'
  },
  { 
    id: 'MOH-402851', 
    address: '5704 Menchaca Rd Unit 21, Austin, TX 78745', 
    ownerSeller: 'Bette Williams', 
    accountNum: 'TC25594', 
    community: 'Towne Court', 
    package: 'S TRECPO', 
    scheduled: '04/01/25', 
    status: 'Scheduled', 
    settlement: '04/15/25', 
    submitted: '03/18/25',
    type: 'Resale Certificate',
    priority: 'Urgent'
  },
  { 
    id: 'MOH-402500', 
    address: '107 Sunrise Ridge Cv Unit 1603, Austin, TX 78738', 
    ownerSeller: 'James Wilson', 
    accountNum: 'EAV45133', 
    community: 'Enclave at Alta Vista', 
    package: 'E CQ', 
    scheduled: '04/02/25', 
    status: 'Past Due', 
    settlement: '', 
    submitted: '03/28/25',
    type: 'Compliance Questionnaire',
    priority: 'Expedited'
  }
];

interface OrderQueueProps {}

const ResaleOrderQueue: React.FC<OrderQueueProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentTab, setCurrentTab] = useState('all');

  // Filter orders based on search term and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.ownerSeller && order.ownerSeller.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.community.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
    const matchesType = typeFilter === 'all' || order.type.toLowerCase().includes(typeFilter.toLowerCase());
    const matchesTab = currentTab === 'all' || 
                      (currentTab === 'scheduled' && order.status === 'Scheduled') ||
                      (currentTab === 'inprogress' && (order.status === 'In Review' || order.status === 'In Progress')) ||
                      (currentTab === 'completed' && order.status === 'Completed') ||
                      (currentTab === 'pastdue' && order.status === 'Past Due');
    
    return matchesSearch && matchesStatus && matchesPriority && matchesType && matchesTab;
  });

  const handleGenerateDocument = (order: any) => {
    // Mock data for PDF generation
    const resaleCertData = {
      propertyAddress: order.address,
      unitNumber: order.address.includes('Unit') ? order.address.split('Unit ')[1] : '',
      associationName: order.community,
      ownerName: order.ownerSeller,
      purchaserName: 'New Buyer',
      closingDate: order.settlement || 'TBD',
      assessmentAmount: '$250.00',
      outstandingDues: '$0.00',
      specialAssessments: 'None',
      certifiedBy: 'System Administrator',
      certificationDate: new Date().toLocaleDateString(),
    };

    const doc = generateResaleCertificate(resaleCertData);
    // Download the PDF
    doc.save(`${order.id}_${order.type.replace(' ', '_')}.pdf`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return <Badge className="bg-amber-500">Scheduled</Badge>;
      case 'In Review':
        return <Badge className="bg-blue-500">In Review</Badge>;
      case 'Completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'Past Due':
        return <Badge className="bg-red-500">Past Due</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return <Badge className="bg-red-500">Urgent</Badge>;
      case 'Expedited':
        return <Badge className="bg-purple-500">Expedited</Badge>;
      case 'Regular':
        return <Badge variant="outline">Regular</Badge>;
      case 'Standard':
        return <Badge variant="outline">Standard</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
        <div className="flex justify-between">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              All Orders
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Scheduled
            </TabsTrigger>
            <TabsTrigger value="inprogress" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              In Progress
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Completed
            </TabsTrigger>
            <TabsTrigger value="pastdue" className="flex items-center gap-2">
              <FileX className="h-4 w-4" />
              Past Due
            </TabsTrigger>
          </TabsList>
          <TooltipButton
            tooltipText="Export order data" 
            variant="outline" 
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </TooltipButton>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by ID, address, owner, or community..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex flex-row gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="In Review">In Review</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Past Due">Past Due</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
                <SelectItem value="Expedited">Expedited</SelectItem>
                <SelectItem value="Regular">Regular</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Document Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="resale">Resale Certificate</SelectItem>
                <SelectItem value="questionnaire">Questionnaire</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="mortgage">Mortgage</SelectItem>
              </SelectContent>
            </Select>
            
            <TooltipButton
              tooltipText="Apply additional filters"
              variant="outline" 
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              More Filters
            </TooltipButton>
          </div>
        </div>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Order Queue</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Showing {filteredOrders.length} of {orders.length} orders
                </div>
              </div>
              <CardDescription>Manage and process resale documentation orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Order #</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Owner/Seller</TableHead>
                    <TableHead>Community</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell className="max-w-[300px] truncate" title={order.address}>
                          {order.address}
                        </TableCell>
                        <TableCell>{order.ownerSeller || 'N/A'}</TableCell>
                        <TableCell>{order.community}</TableCell>
                        <TableCell>{order.type}</TableCell>
                        <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                        <TableCell>{order.scheduled}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => {}}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View order details</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleGenerateDocument(order)}
                                  >
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Generate document</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {order.status !== 'Completed' && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => {}}
                                    >
                                      <FilePen className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit order</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No orders found matching your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Duplicate TabsContent for other tabs with specific views */}
        <TabsContent value="scheduled" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Orders</CardTitle>
              <CardDescription>All orders scheduled for processing</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table as above, but for scheduled items */}
              <Table>{/* ... */}</Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inprogress" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>In Progress Orders</CardTitle>
              <CardDescription>Orders currently being processed</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table as above, but for in progress items */}
              <Table>{/* ... */}</Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Orders</CardTitle>
              <CardDescription>Successfully completed orders</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table as above, but for completed items */}
              <Table>{/* ... */}</Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pastdue" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Past Due Orders</CardTitle>
              <CardDescription>Orders that require immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table as above, but for past due items */}
              <Table>{/* ... */}</Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResaleOrderQueue;
