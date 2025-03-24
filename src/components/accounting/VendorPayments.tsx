
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building, 
  CreditCard,
  Clock,
  CheckCircle, 
  XCircle,
  Filter, 
  RefreshCw, 
  Download, 
  PlusCircle, 
  Search,
  Calendar
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VendorPayment } from '@/components/settings/associations/types';

interface VendorPaymentsProps {
  className?: string;
}

const VendorPayments: React.FC<VendorPaymentsProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('all');
  
  const [payments, setPayments] = useState<VendorPayment[]>([
    {
      id: "PAY-001",
      vendorId: "VEN-001",
      invoiceId: "VINV-001",
      amount: 750.00,
      date: "2023-06-15",
      description: "Landscaping services - June",
      status: "paid",
      paymentMethod: "ACH Transfer",
      referenceNumber: "ACH987654",
      associationId: "ASSOC-001"
    },
    {
      id: "PAY-002",
      vendorId: "VEN-002",
      invoiceId: "VINV-002",
      amount: 450.00,
      date: "2023-06-20",
      description: "Pool maintenance - June",
      status: "paid",
      paymentMethod: "Check",
      referenceNumber: "CHK1001",
      associationId: "ASSOC-001"
    },
    {
      id: "PAY-003",
      vendorId: "VEN-003",
      invoiceId: "VINV-003",
      amount: 1250.00,
      date: "2023-06-25",
      description: "Security services - June",
      status: "pending",
      paymentMethod: "ACH Transfer",
      associationId: "ASSOC-001"
    },
    {
      id: "PAY-004",
      vendorId: "VEN-004",
      invoiceId: "VINV-004",
      amount: 325.00,
      date: "2023-06-28",
      description: "Pest control services",
      status: "pending",
      paymentMethod: "Credit Card",
      associationId: "ASSOC-001"
    },
    {
      id: "PAY-005",
      vendorId: "VEN-001",
      invoiceId: "VINV-005",
      amount: 800.00,
      date: "2023-06-30",
      description: "Emergency tree removal",
      status: "void",
      paymentMethod: "Check",
      referenceNumber: "CHK1002",
      associationId: "ASSOC-001"
    }
  ]);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500 flex items-center gap-1"><CheckCircle size={14} /> Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 flex items-center gap-1"><Clock size={14} /> Pending</Badge>;
      case 'void':
        return <Badge variant="outline" className="flex items-center gap-1"><XCircle size={14} /> Void</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Vendor Payments
        </CardTitle>
        <CardDescription>
          Manage and track payments to vendors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 items-start sm:items-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-1">
                <Clock size={14} /> Pending
              </TabsTrigger>
              <TabsTrigger value="paid" className="flex items-center gap-1">
                <CheckCircle size={14} /> Paid
              </TabsTrigger>
              <TabsTrigger value="void" className="flex items-center gap-1">
                <XCircle size={14} /> Void
              </TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <RefreshCw size={16} /> Refresh
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download size={16} /> Export
              </Button>
              <Button size="sm" className="flex items-center gap-1">
                <PlusCircle size={16} /> New Payment
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input 
                  placeholder="Search by vendor, invoice #..." 
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 pl-8 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Button variant="outline" size="icon" className="shrink-0">
                <Calendar size={16} />
              </Button>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter size={16} />
              </Button>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="ach">ACH Transfer</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="creditCard">Credit Card</SelectItem>
                  <SelectItem value="wire">Wire Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value="all" className="m-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map(payment => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                      <TableCell>{payment.vendorId}</TableCell>
                      <TableCell>{payment.invoiceId || 'N/A'}</TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell className="text-right">${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>{payment.paymentMethod}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">View</Button>
                          {payment.status === 'pending' && (
                            <Button variant="outline" size="sm">Process</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Filter for other tab values */}
          {['pending', 'paid', 'void'].map(tabValue => (
            <TabsContent key={tabValue} value={tabValue} className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableCaption>
                    {`Showing only ${tabValue} payments`}
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments
                      .filter(payment => payment.status === tabValue)
                      .map(payment => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.id}</TableCell>
                          <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                          <TableCell>{payment.vendorId}</TableCell>
                          <TableCell>{payment.invoiceId || 'N/A'}</TableCell>
                          <TableCell>{payment.description}</TableCell>
                          <TableCell className="text-right">${payment.amount.toFixed(2)}</TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          <TableCell>{payment.paymentMethod}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="sm">View</Button>
                              {payment.status === 'pending' && (
                                <Button variant="outline" size="sm">Process</Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default VendorPayments;
