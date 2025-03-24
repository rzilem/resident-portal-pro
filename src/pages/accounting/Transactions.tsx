
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, RefreshCw, Download, PlusCircle, Search, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Transaction } from '@/components/settings/associations/types';

const Transactions = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "TRX-001",
      date: "2023-06-15",
      amount: 250.00,
      type: "assessment",
      description: "Monthly HOA dues",
      propertyId: "PROP-123",
      residentId: "RES-456",
      status: "completed",
      referenceNumber: "REF123456",
      createdAt: "2023-06-15T10:30:00Z",
      updatedAt: "2023-06-15T10:30:00Z",
    },
    {
      id: "TRX-002",
      date: "2023-06-20",
      amount: 100.00,
      type: "fine",
      description: "Late payment fee",
      propertyId: "PROP-124",
      residentId: "RES-789",
      status: "pending",
      referenceNumber: "REF789012",
      createdAt: "2023-06-20T14:15:00Z",
      updatedAt: "2023-06-20T14:15:00Z",
    },
    {
      id: "TRX-003",
      date: "2023-06-25",
      amount: 450.00,
      type: "payment",
      description: "Payment received",
      propertyId: "PROP-125",
      residentId: "RES-101",
      status: "completed",
      referenceNumber: "REF101112",
      createdAt: "2023-06-25T09:45:00Z",
      updatedAt: "2023-06-25T09:45:00Z",
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      case 'void':
        return <Badge variant="outline">Void</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: TransactionType) => {
    switch (type) {
      case 'payment':
        return <Badge className="bg-blue-500">Payment</Badge>;
      case 'assessment':
        return <Badge className="bg-purple-500">Assessment</Badge>;
      case 'fine':
        return <Badge className="bg-red-500">Fine</Badge>;
      case 'fee':
        return <Badge className="bg-orange-500">Fee</Badge>;
      case 'credit':
        return <Badge className="bg-green-500">Credit</Badge>;
      case 'refund':
        return <Badge className="bg-teal-500">Refund</Badge>;
      case 'adjustment':
        return <Badge className="bg-gray-500">Adjustment</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 p-4 md:p-6">
        <div className="grid gap-4 md:gap-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Transactions</h1>
              <p className="text-muted-foreground">
                Manage all financial transactions for your properties
              </p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <RefreshCw size={16} /> Refresh
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download size={16} /> Export
              </Button>
              <Button size="sm" className="flex items-center gap-1">
                <PlusCircle size={16} /> New Transaction
              </Button>
            </div>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Transaction List</CardTitle>
            <CardDescription>
              View and manage all financial transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search transactions..." className="pl-8" />
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
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="assessment">Assessment</SelectItem>
                    <SelectItem value="fine">Fine</SelectItem>
                    <SelectItem value="fee">Fee</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                    <SelectItem value="refund">Refund</SelectItem>
                    <SelectItem value="adjustment">Adjustment</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="void">Void</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reference #</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map(transaction => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{getTypeBadge(transaction.type)}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className="text-right">${transaction.amount.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell>{transaction.referenceNumber}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Transactions;
