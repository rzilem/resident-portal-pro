
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, Home, CreditCard, Clock, Mail, Phone, MapPin, 
  FileText, MessageCircle, Bell, ArrowLeft, Building, 
  Calendar, Download, CircleDollarSign, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Define types for our resident data to avoid TypeScript errors
type PropertyDetails = {
  address: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  leaseStart?: string;
  leaseEnd?: string;
  monthlyAssessment?: string;
  deposit?: string;
  taxDistrict?: string;
  taxId?: string;
}

type LastPayment = {
  date: string;
  amount: string;
  method: string;
}

type Transaction = {
  date: string;
  description: string;
  amount: string;
  balance: string;
}

type Communication = {
  date: string;
  type: string;
  subject: string;
  status: string;
}

type Note = {
  date: string;
  author: string;
  content: string;
}

type Document = {
  name: string;
  type: string;
  date: string;
  size: string;
}

type ResidentProfile = {
  id: number;
  name: string;
  unit: string;
  property: string;
  email: string;
  phone: string;
  status: string;
  moveInDate: string;
  moveOutDate?: string;
  paymentPreference?: string;
  balance: string;
  lastPayment?: LastPayment;
  accountHistory?: Transaction[];
  communications: Communication[];
  notes: Note[];
  documents: Document[];
  propertyDetails: PropertyDetails;
}

// Mock data for resident profiles
const residentProfiles: Record<number, ResidentProfile> = {
  101: {
    id: 101,
    name: 'Alice Johnson',
    unit: '301',
    property: 'Oakwood Heights',
    email: 'alice.j@example.com',
    phone: '(555) 123-4567',
    status: 'Active',
    moveInDate: '2021-03-15',
    paymentPreference: 'Auto-pay (Credit Card)',
    balance: '$0.00',
    lastPayment: { date: '2023-06-01', amount: '$1,200.00', method: 'Credit Card' },
    accountHistory: [
      { date: '2023-06-01', description: 'Monthly Assessment Payment', amount: '$1,200.00', balance: '$0.00' },
      { date: '2023-05-15', description: 'Late Fee', amount: '$50.00', balance: '$1,250.00' },
      { date: '2023-05-01', description: 'Monthly Assessment Payment', amount: '$1,200.00', balance: '$0.00' },
      { date: '2023-04-01', description: 'Monthly Assessment Payment', amount: '$1,200.00', balance: '$0.00' },
    ],
    communications: [
      { date: '2023-05-20', type: 'Email', subject: 'Late Payment Reminder', status: 'Delivered' },
      { date: '2023-05-10', type: 'Text Message', subject: 'Payment Due Reminder', status: 'Delivered' },
      { date: '2023-04-15', type: 'Email', subject: 'Community Newsletter', status: 'Opened' },
    ],
    notes: [
      { date: '2023-05-16', author: 'System', content: 'Late payment notice automatically sent' },
      { date: '2023-05-02', author: 'Jane Smith', content: 'Resident called about maintenance request for kitchen sink' },
      { date: '2023-04-10', author: 'John Doe', content: 'Resident mentioned they might renew for another year' },
    ],
    documents: [
      { name: 'Lease Agreement', type: 'PDF', date: '2021-03-01', size: '1.2 MB' },
      { name: 'Move-in Inspection', type: 'PDF', date: '2021-03-15', size: '2.4 MB' },
      { name: 'Maintenance Request #103', type: 'PDF', date: '2023-05-02', size: '0.8 MB' },
    ],
    propertyDetails: {
      address: '123 Oakwood Dr, Seattle, WA 98101',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      leaseStart: '2023-01-01',
      leaseEnd: '2023-12-31',
      monthlyAssessment: '$1,200.00',
      deposit: '$1,800.00',
      taxDistrict: 'North Seattle',
      taxId: 'TX-10145-A'
    }
  },
  102: {
    id: 102,
    name: 'Robert Smith',
    unit: '142',
    property: 'Willow Creek Estates',
    email: 'robert.s@example.com',
    phone: '(555) 987-6543',
    status: 'Active',
    moveInDate: '2020-06-10',
    paymentPreference: 'Bank Transfer',
    balance: '$0.00',
    lastPayment: { date: '2023-06-01', amount: '$1,450.00', method: 'Bank Transfer' },
    accountHistory: [
      { date: '2023-06-01', description: 'Monthly Assessment Payment', amount: '$1,450.00', balance: '$0.00' },
      { date: '2023-05-01', description: 'Monthly Assessment Payment', amount: '$1,450.00', balance: '$0.00' },
      { date: '2023-04-01', description: 'Monthly Assessment Payment', amount: '$1,450.00', balance: '$0.00' },
    ],
    communications: [
      { date: '2023-05-15', type: 'Email', subject: 'Community Newsletter', status: 'Opened' },
      { date: '2023-04-25', type: 'Email', subject: 'Maintenance Notification', status: 'Delivered' },
      { date: '2023-04-10', type: 'Text Message', subject: 'Payment Confirmation', status: 'Delivered' },
    ],
    notes: [
      { date: '2023-05-20', author: 'Jane Smith', content: 'Resident inquired about renewing lease' },
      { date: '2023-04-12', author: 'John Doe', content: 'Completed annual unit inspection - all in good condition' },
    ],
    documents: [
      { name: 'Lease Agreement', type: 'PDF', date: '2020-06-01', size: '1.4 MB' },
      { name: 'Move-in Inspection', type: 'PDF', date: '2020-06-10', size: '2.1 MB' },
      { name: 'Lease Renewal 2022', type: 'PDF', date: '2022-05-15', size: '1.1 MB' },
    ],
    propertyDetails: {
      address: '456 Willow Ave, Portland, OR 97201',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1650,
      leaseStart: '2023-01-01',
      leaseEnd: '2023-12-31',
      monthlyAssessment: '$1,450.00',
      deposit: '$2,175.00',
      taxDistrict: 'Portland Metro',
      taxId: 'PDX-2367'
    }
  },
  103: {
    id: 103,
    name: 'Emily Davis',
    unit: '506',
    property: 'Riverfront Towers',
    email: 'emily.d@example.com',
    phone: '(555) 456-7890',
    status: 'Active',
    moveInDate: '2022-01-05',
    paymentPreference: 'Auto-pay (Credit Card)',
    balance: '$25.00',
    lastPayment: { date: '2023-06-01', amount: '$1,575.00', method: 'Credit Card' },
    accountHistory: [
      { date: '2023-06-01', description: 'Monthly Assessment Payment', amount: '$1,575.00', balance: '$25.00' },
      { date: '2023-05-28', description: 'Maintenance Fee', amount: '$25.00', balance: '$25.00' },
      { date: '2023-05-01', description: 'Monthly Assessment Payment', amount: '$1,575.00', balance: '$0.00' },
    ],
    communications: [],
    notes: [],
    documents: [],
    propertyDetails: {
      address: '789 River Rd, Denver, CO 80201',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1350,
      leaseStart: '2023-01-01',
      leaseEnd: '2023-12-31',
      monthlyAssessment: '$1,575.00',
      deposit: '$2,000.00'
    }
  },
  201: {
    id: 201,
    name: 'Michael Wilson',
    unit: '203',
    property: 'Sunset Gardens',
    email: 'michael.w@example.com',
    phone: '(555) 222-3333',
    status: 'Pending',
    moveInDate: 'Pending Approval',
    balance: '$0.00',
    communications: [],
    notes: [],
    documents: [],
    propertyDetails: {
      address: '321 Sunset Blvd, San Diego, CA 92101',
      bedrooms: 1,
      bathrooms: 1,
      sqft: 850
    }
  },
  202: {
    id: 202,
    name: 'Sarah Brown',
    unit: '118',
    property: 'Pine Valley Community',
    email: 'sarah.b@example.com',
    phone: '(555) 444-5555',
    status: 'Active',
    moveInDate: '2021-08-15',
    balance: '$0.00',
    communications: [],
    notes: [],
    documents: [],
    propertyDetails: {
      address: '555 Pine St, Austin, TX 78701',
      bedrooms: 2,
      bathrooms: 1,
      sqft: 1100,
      leaseStart: '2023-01-01',
      leaseEnd: '2023-12-31',
      monthlyAssessment: '$1,300.00',
      deposit: '$1,950.00'
    }
  },
  301: {
    id: 301,
    name: 'David Miller',
    unit: '224',
    property: 'Oakwood Heights',
    email: 'david.m@example.com',
    phone: '(555) 666-7777',
    status: 'Inactive',
    moveInDate: '2019-05-10',
    moveOutDate: '2023-05-31',
    balance: '$0.00',
    communications: [],
    notes: [],
    documents: [],
    propertyDetails: {
      address: '123 Oakwood Dr, Seattle, WA 98101',
      bedrooms: 1,
      bathrooms: 1,
      sqft: 750
    }
  }
};

// Helper function to get badge variant
const getStatusBadgeVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
  switch (status) {
    case "Active":
      return "default"; // Using default instead of success
    case "Pending":
      return "secondary"; // Using secondary instead of warning
    default:
      return "outline";
  }
};

const ResidentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const residentId = parseInt(id || '0');
  const resident = residentProfiles[residentId];

  if (!resident) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Resident Not Found</h1>
        <p className="mb-4">The resident profile you're looking for doesn't exist.</p>
        <Link to="/residents">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Residents
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 animate-fade-in">
      <div className="mb-6">
        <Link to="/residents" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Residents
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{resident.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" />
              <span>{resident.property} • Unit {resident.unit}</span>
              <Badge variant={getStatusBadgeVariant(resident.status)}>
                {resident.status}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href={`mailto:${resident.email}`}>
                <Mail className="mr-2 h-4 w-4" />
                Email
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={`tel:${resident.phone}`}>
                <Phone className="mr-2 h-4 w-4" />
                Call
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={`sms:${resident.phone}`}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Text
              </a>
            </Button>
            <Button>
              <Bell className="mr-2 h-4 w-4" />
              Send Notice
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="property">Property</TabsTrigger>
        </TabsList>
        
        {/* Summary Tab */}
        <TabsContent value="summary">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resident Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <User className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-muted-foreground">{resident.name}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{resident.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{resident.phone}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Move-in Date</p>
                    <p className="text-sm text-muted-foreground">{resident.moveInDate}</p>
                  </div>
                </div>
                {resident.moveOutDate && (
                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Move-out Date</p>
                      <p className="text-sm text-muted-foreground">{resident.moveOutDate}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Property Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Building className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Property</p>
                    <p className="text-sm text-muted-foreground">{resident.property}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Home className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Unit</p>
                    <p className="text-sm text-muted-foreground">{resident.unit}</p>
                  </div>
                </div>
                {resident.propertyDetails && (
                  <>
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Address</p>
                        <p className="text-sm text-muted-foreground">{resident.propertyDetails.address}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium">Bedrooms</p>
                        <p className="text-sm text-muted-foreground">{resident.propertyDetails.bedrooms}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Bathrooms</p>
                        <p className="text-sm text-muted-foreground">{resident.propertyDetails.bathrooms}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Square Feet</p>
                        <p className="text-sm text-muted-foreground">{resident.propertyDetails.sqft}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <CircleDollarSign className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Current Balance</p>
                    <p className="text-sm font-semibold">{resident.balance}</p>
                  </div>
                </div>
                
                {resident.lastPayment && (
                  <div className="flex items-start">
                    <CreditCard className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Last Payment</p>
                      <p className="text-sm text-muted-foreground">
                        {resident.lastPayment.amount} on {resident.lastPayment.date} via {resident.lastPayment.method}
                      </p>
                    </div>
                  </div>
                )}
                
                {resident.paymentPreference && (
                  <div className="flex items-start">
                    <CreditCard className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Payment Method</p>
                      <p className="text-sm text-muted-foreground">{resident.paymentPreference}</p>
                    </div>
                  </div>
                )}
                
                {resident.propertyDetails?.monthlyAssessment && (
                  <div className="flex items-start">
                    <CircleDollarSign className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Monthly Assessment</p>
                      <p className="text-sm text-muted-foreground">{resident.propertyDetails.monthlyAssessment}</p>
                    </div>
                  </div>
                )}
                
                {resident.propertyDetails?.leaseStart && resident.propertyDetails?.leaseEnd && (
                  <div className="flex items-start">
                    <FileText className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Ownership Period</p>
                      <p className="text-sm text-muted-foreground">
                        {resident.propertyDetails.leaseStart} to {resident.propertyDetails.leaseEnd}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Financial Tab */}
        <TabsContent value="financial">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  Complete financial history for this resident
                </CardDescription>
              </div>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              {resident.accountHistory && resident.accountHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resident.accountHistory.map((transaction, i) => (
                      <TableRow key={i}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell className="text-right">{transaction.amount}</TableCell>
                        <TableCell className="text-right">{transaction.balance}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No transaction history available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Communications Tab */}
        <TabsContent value="communications">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Communication History</CardTitle>
                <CardDescription>
                  Record of all communications with this resident
                </CardDescription>
              </div>
              <Button>
                <MessageCircle className="mr-2 h-4 w-4" />
                New Message
              </Button>
            </CardHeader>
            <CardContent>
              {resident.communications && resident.communications.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resident.communications.map((comm, i) => (
                      <TableRow key={i}>
                        <TableCell>{comm.date}</TableCell>
                        <TableCell>{comm.type}</TableCell>
                        <TableCell>{comm.subject}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            comm.status === 'Opened' ? 'bg-green-100 text-green-800' : 
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {comm.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No communication history available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notes Tab */}
        <TabsContent value="notes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Notes</CardTitle>
                <CardDescription>
                  Internal notes about this resident
                </CardDescription>
              </div>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </CardHeader>
            <CardContent>
              {resident.notes && resident.notes.length > 0 ? (
                <div className="space-y-4">
                  {resident.notes.map((note, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold">{note.author}</p>
                        <p className="text-sm text-muted-foreground">{note.date}</p>
                      </div>
                      <p>{note.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No notes available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Documents</CardTitle>
                <CardDescription>
                  All documents related to this resident
                </CardDescription>
              </div>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </CardHeader>
            <CardContent>
              {resident.documents && resident.documents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resident.documents.map((doc, i) => (
                      <TableRow key={i}>
                        <TableCell>{doc.name}</TableCell>
                        <TableCell>{doc.type}</TableCell>
                        <TableCell>{doc.date}</TableCell>
                        <TableCell>{doc.size}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No documents available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Property Tab */}
        <TabsContent value="property">
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
              <CardDescription>
                Information about the resident's unit and property
              </CardDescription>
            </CardHeader>
            <CardContent>
              {resident.propertyDetails ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Unit Information</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Unit Number</p>
                          <p className="text-muted-foreground">{resident.unit}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Square Footage</p>
                          <p className="text-muted-foreground">{resident.propertyDetails.sqft} sq ft</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Bedrooms</p>
                          <p className="text-muted-foreground">{resident.propertyDetails.bedrooms}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Bathrooms</p>
                          <p className="text-muted-foreground">{resident.propertyDetails.bathrooms}</p>
                        </div>
                      </div>
                      
                      <div className="border p-3 rounded-md bg-slate-50 mt-2">
                        <h4 className="font-medium text-sm mb-2">Property Tax Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium">Tax District</p>
                            <p className="text-muted-foreground">{resident.propertyDetails.taxDistrict || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Tax ID</p>
                            <p className="text-muted-foreground font-mono">{resident.propertyDetails.taxId || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <a 
                            href="https://hometaxshield.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline flex items-center gap-1"
                          >
                            View on HomeTaxShield
                            <ArrowLeft className="h-3 w-3 rotate-180" />
                          </a>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <p className="text-sm font-medium">Full Address</p>
                        <p className="text-muted-foreground">{resident.propertyDetails.address}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Ownership Information</h3>
                    <div className="space-y-4">
                      {resident.propertyDetails.leaseStart && resident.propertyDetails.leaseEnd && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Start Date</p>
                              <p className="text-muted-foreground">{resident.propertyDetails.leaseStart}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">End Date</p>
                              <p className="text-muted-foreground">{resident.propertyDetails.leaseEnd}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Monthly Assessment</p>
                              <p className="text-muted-foreground">{resident.propertyDetails.monthlyAssessment}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Security Deposit</p>
                              <p className="text-muted-foreground">{resident.propertyDetails.deposit}</p>
                            </div>
                          </div>
                        </>
                      )}
                      
                      <div className="mt-6 flex justify-end gap-2">
                        <Button variant="outline">View Ownership Documents</Button>
                        {resident.status === 'Active' && (
                          <Button>Manage Ownership</Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No property details available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResidentProfile;
