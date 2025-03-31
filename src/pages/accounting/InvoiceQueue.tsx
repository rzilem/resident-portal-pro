
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TooltipButton } from "@/components/ui/tooltip-button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter, Search, Check, X, Eye, FileText } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { getInvoices, approveInvoice, voidInvoice, Invoice } from '@/services/accountingService';
import InvoiceActionButtons from '@/components/accounting/invoices/InvoiceActionButtons';

const InvoiceQueue = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await getInvoices();
        setInvoices(data);
        setFilteredInvoices(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        setIsLoading(false);
      }
    };
    
    fetchInvoices();
  }, []);
  
  useEffect(() => {
    // Filter invoices based on search term and status filter
    let filtered = [...invoices];
    
    if (searchTerm) {
      filtered = filtered.filter(invoice => 
        invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (invoice.description && invoice.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }
    
    setFilteredInvoices(filtered);
  }, [searchTerm, statusFilter, invoices]);
  
  const handleViewInvoice = (id: string) => {
    navigate(`/accounting/invoice-coding?id=${id}`);
  };
  
  const handleApproveInvoice = async (id: string) => {
    await approveInvoice(id);
    // Update the local state to reflect the change
    setInvoices(invoices.map(invoice => 
      invoice.id === id ? { ...invoice, status: 'approved' } : invoice
    ));
  };
  
  const handleVoidInvoice = async (id: string) => {
    await voidInvoice(id);
    // Update the local state to reflect the change
    setInvoices(invoices.map(invoice => 
      invoice.id === id ? { ...invoice, status: 'void' } : invoice
    ));
  };
  
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="bg-gray-100">Draft</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Paid</Badge>;
      case 'void':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Void</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Invoice Queue</h1>
        <InvoiceActionButtons />
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Pending Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search invoices..." 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter size={16} />
              </Button>
            </div>
            <div className="flex gap-2">
              <select
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="paid">Paid</option>
                <option value="void">Void</option>
              </select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <p className="text-muted-foreground">Loading invoices...</p>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="flex justify-center items-center h-48">
              <p className="text-muted-foreground">No invoices found</p>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="hidden md:table-cell">Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.number}</TableCell>
                      <TableCell>{invoice.vendor}</TableCell>
                      <TableCell className="hidden md:table-cell">{invoice.date}</TableCell>
                      <TableCell className="hidden md:table-cell">{invoice.dueDate}</TableCell>
                      <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>{renderStatusBadge(invoice.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <TooltipButton
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewInvoice(invoice.id)}
                            tooltipText="View invoice details"
                          >
                            <Eye className="h-4 w-4" />
                          </TooltipButton>
                          
                          {invoice.status === 'pending' && (
                            <TooltipButton
                              variant="ghost"
                              size="icon"
                              onClick={() => handleApproveInvoice(invoice.id)}
                              tooltipText="Approve invoice"
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </TooltipButton>
                          )}
                          
                          {(invoice.status === 'pending' || invoice.status === 'draft') && (
                            <TooltipButton
                              variant="ghost"
                              size="icon"
                              onClick={() => handleVoidInvoice(invoice.id)}
                              tooltipText="Void invoice"
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </TooltipButton>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceQueue;
