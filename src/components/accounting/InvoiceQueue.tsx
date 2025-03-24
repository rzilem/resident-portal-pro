
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
  FileText, 
  Send, 
  Clock, 
  AlertCircle, 
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
import { Invoice } from '@/components/settings/associations/types';

interface InvoiceQueueProps {
  className?: string;
}

const InvoiceQueue: React.FC<InvoiceQueueProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('all');
  
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "INV-001",
      invoiceNumber: "INV2023-001",
      date: "2023-06-01",
      dueDate: "2023-06-30",
      amount: 350.00,
      status: "sent",
      recipientId: "RES-456",
      recipientType: "resident",
      items: [
        {
          id: "ITEM-001",
          description: "Monthly HOA dues",
          quantity: 1,
          unitPrice: 250.00,
          total: 250.00,
          category: "dues"
        },
        {
          id: "ITEM-002",
          description: "Pool maintenance fee",
          quantity: 1,
          unitPrice: 100.00,
          total: 100.00,
          category: "maintenance"
        }
      ],
      createdAt: "2023-06-01T10:00:00Z",
      updatedAt: "2023-06-01T10:00:00Z"
    },
    {
      id: "INV-002",
      invoiceNumber: "INV2023-002",
      date: "2023-06-05",
      dueDate: "2023-07-05",
      amount: 450.00,
      status: "draft",
      recipientId: "RES-789",
      recipientType: "resident",
      items: [
        {
          id: "ITEM-003",
          description: "Monthly HOA dues",
          quantity: 1,
          unitPrice: 250.00,
          total: 250.00,
          category: "dues"
        },
        {
          id: "ITEM-004",
          description: "Special assessment",
          quantity: 1,
          unitPrice: 200.00,
          total: 200.00,
          category: "assessment"
        }
      ],
      createdAt: "2023-06-05T14:30:00Z",
      updatedAt: "2023-06-05T14:30:00Z"
    },
    {
      id: "INV-003",
      invoiceNumber: "INV2023-003",
      date: "2023-05-15",
      dueDate: "2023-06-15",
      amount: 250.00,
      status: "overdue",
      recipientId: "RES-101",
      recipientType: "resident",
      items: [
        {
          id: "ITEM-005",
          description: "Monthly HOA dues",
          quantity: 1,
          unitPrice: 250.00,
          total: 250.00,
          category: "dues"
        }
      ],
      createdAt: "2023-05-15T09:00:00Z",
      updatedAt: "2023-05-15T09:00:00Z"
    },
    {
      id: "INV-004",
      invoiceNumber: "INV2023-004",
      date: "2023-06-10",
      dueDate: "2023-07-10",
      amount: 750.00,
      status: "paid",
      recipientId: "VEN-001",
      recipientType: "vendor",
      items: [
        {
          id: "ITEM-006",
          description: "Landscaping services",
          quantity: 1,
          unitPrice: 750.00,
          total: 750.00,
          category: "service"
        }
      ],
      createdAt: "2023-06-10T11:30:00Z",
      updatedAt: "2023-06-12T15:45:00Z"
    }
  ]);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="flex items-center gap-1"><Clock size={14} /> Draft</Badge>;
      case 'sent':
        return <Badge className="bg-blue-500 flex items-center gap-1"><Send size={14} /> Sent</Badge>;
      case 'paid':
        return <Badge className="bg-green-500 flex items-center gap-1"><CheckCircle size={14} /> Paid</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500 flex items-center gap-1"><AlertCircle size={14} /> Overdue</Badge>;
      case 'void':
        return <Badge variant="outline" className="flex items-center gap-1"><XCircle size={14} /> Void</Badge>;
      case 'partially_paid':
        return <Badge className="bg-yellow-500 flex items-center gap-1"><Clock size={14} /> Partially Paid</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Invoice Queue
        </CardTitle>
        <CardDescription>
          Manage and track all invoices in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 items-start sm:items-center">
            <TabsList>
              <TabsTrigger value="all" className="flex items-center gap-1">
                <FileText size={14} /> All
              </TabsTrigger>
              <TabsTrigger value="draft" className="flex items-center gap-1">
                <Clock size={14} /> Draft
              </TabsTrigger>
              <TabsTrigger value="sent" className="flex items-center gap-1">
                <Send size={14} /> Sent
              </TabsTrigger>
              <TabsTrigger value="overdue" className="flex items-center gap-1">
                <AlertCircle size={14} /> Overdue
              </TabsTrigger>
              <TabsTrigger value="paid" className="flex items-center gap-1">
                <CheckCircle size={14} /> Paid
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
                <PlusCircle size={16} /> New Invoice
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input 
                  placeholder="Search by invoice #, recipient..." 
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
          </div>
          
          <TabsContent value="all" className="m-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map(invoice => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {invoice.recipientType === 'resident' ? 'Resident' : 'Vendor'}-{invoice.recipientId}
                      </TableCell>
                      <TableCell className="text-right">${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">View</Button>
                          {invoice.status === 'draft' && (
                            <Button variant="outline" size="sm">Send</Button>
                          )}
                          {invoice.status === 'sent' && (
                            <Button variant="outline" size="sm">Remind</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* We'll filter the same data for each tab */}
          <TabsContent value="draft" className="m-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices
                    .filter(invoice => invoice.status === 'draft')
                    .map(invoice => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                        <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {invoice.recipientType === 'resident' ? 'Resident' : 'Vendor'}-{invoice.recipientId}
                        </TableCell>
                        <TableCell className="text-right">${invoice.amount.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="outline" size="sm">Send</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Similar TabsContent sections for sent, overdue, and paid statuses */}
          {/* For brevity, I'll only implement these with placeholder content */}
          <TabsContent value="sent" className="m-0">
            <div className="rounded-md border">
              <Table>
                <TableCaption>Only showing invoices with 'Sent' status</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices
                    .filter(invoice => invoice.status === 'sent')
                    .map(invoice => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                        <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {invoice.recipientType === 'resident' ? 'Resident' : 'Vendor'}-{invoice.recipientId}
                        </TableCell>
                        <TableCell className="text-right">${invoice.amount.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="outline" size="sm">Remind</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Overdue Tab */}
          <TabsContent value="overdue" className="m-0">
            <div className="rounded-md border">
              <Table>
                <TableCaption>Only showing invoices with 'Overdue' status</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices
                    .filter(invoice => invoice.status === 'overdue')
                    .map(invoice => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                        <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {invoice.recipientType === 'resident' ? 'Resident' : 'Vendor'}-{invoice.recipientId}
                        </TableCell>
                        <TableCell className="text-right">${invoice.amount.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="outline" size="sm">Send Reminder</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Paid Tab */}
          <TabsContent value="paid" className="m-0">
            <div className="rounded-md border">
              <Table>
                <TableCaption>Only showing invoices with 'Paid' status</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices
                    .filter(invoice => invoice.status === 'paid')
                    .map(invoice => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                        <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {invoice.recipientType === 'resident' ? 'Resident' : 'Vendor'}-{invoice.recipientId}
                        </TableCell>
                        <TableCell className="text-right">${invoice.amount.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="outline" size="sm">Print Receipt</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InvoiceQueue;
