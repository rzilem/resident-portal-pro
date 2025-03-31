
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TooltipButton } from "@/components/ui/tooltip-button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter, Search, Plus, Download, Printer } from "lucide-react";
import { getPayments, recordPayment, Payment } from '@/services/accountingService';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [newPayment, setNewPayment] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    method: 'Credit Card',
    payer: '',
    description: '',
    reference: '',
  });
  
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getPayments();
        setPayments(data);
        setFilteredPayments(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setIsLoading(false);
      }
    };
    
    fetchPayments();
  }, []);
  
  useEffect(() => {
    // Filter payments based on search term and status filter
    let filtered = [...payments];
    
    if (searchTerm) {
      filtered = filtered.filter(payment => 
        payment.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.payer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }
    
    setFilteredPayments(filtered);
  }, [searchTerm, statusFilter, payments]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPayment(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmitPayment = async () => {
    try {
      if (!newPayment.amount || !newPayment.payer) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      const payment = await recordPayment({
        date: newPayment.date,
        amount: parseFloat(newPayment.amount),
        method: newPayment.method,
        payer: newPayment.payer,
        description: newPayment.description,
        reference: newPayment.reference,
        status: 'completed'
      });
      
      setPayments(prev => [payment, ...prev]);
      setIsDialogOpen(false);
      
      // Reset form
      setNewPayment({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        method: 'Credit Card',
        payer: '',
        description: '',
        reference: '',
      });
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error('Failed to record payment');
    }
  };
  
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Payments</h1>
        
        <div className="flex gap-2">
          <TooltipButton
            variant="outline"
            size="sm"
            tooltipText="Export payment data"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </TooltipButton>
          
          <TooltipButton
            variant="outline"
            size="sm"
            tooltipText="Print payment list"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </TooltipButton>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <TooltipButton tooltipText="Record a new payment">
                <Plus className="h-4 w-4 mr-2" />
                Record Payment
              </TooltipButton>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record New Payment</DialogTitle>
                <DialogDescription>
                  Enter the payment details below to record a new payment.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Payment Date</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={newPayment.date}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount*</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">$</span>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={newPayment.amount}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="method">Payment Method</Label>
                  <Select
                    value={newPayment.method}
                    onValueChange={(value) => setNewPayment(prev => ({ ...prev, method: value }))}
                  >
                    <SelectTrigger id="method">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="ACH">ACH / Bank Transfer</SelectItem>
                      <SelectItem value="Check">Check</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payer">Payer Name*</Label>
                  <Input
                    id="payer"
                    name="payer"
                    value={newPayment.payer}
                    onChange={handleInputChange}
                    placeholder="Enter payer name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reference">Reference Number</Label>
                  <Input
                    id="reference"
                    name="reference"
                    value={newPayment.reference}
                    onChange={handleInputChange}
                    placeholder="Optional reference number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    value={newPayment.description}
                    onChange={handleInputChange}
                    placeholder="Payment description"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitPayment}>
                  Record Payment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search payments..." 
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
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <p className="text-muted-foreground">Loading payments...</p>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="flex justify-center items-center h-48">
              <p className="text-muted-foreground">No payments found</p>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="hidden md:table-cell">Payer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="hidden md:table-cell">Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.reference || '-'}</TableCell>
                      <TableCell className="hidden md:table-cell">{payment.payer || '-'}</TableCell>
                      <TableCell>${payment.amount.toFixed(2)}</TableCell>
                      <TableCell className="hidden md:table-cell">{payment.method}</TableCell>
                      <TableCell>{renderStatusBadge(payment.status)}</TableCell>
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

export default Payments;
