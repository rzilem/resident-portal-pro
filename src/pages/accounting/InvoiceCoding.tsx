
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createInvoice } from '@/services/accountingService';
import { toast } from 'sonner';

const InvoiceCoding = () => {
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get('id');
  const navigate = useNavigate();
  
  const [invoiceData, setInvoiceData] = useState({
    vendor: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    category: '',
    description: '',
    status: 'draft'
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setInvoiceData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Basic validation
      if (!invoiceData.vendor || !invoiceData.amount || !invoiceData.date) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      // Create invoice
      await createInvoice({
        vendor: invoiceData.vendor,
        amount: parseFloat(invoiceData.amount),
        date: invoiceData.date,
        dueDate: invoiceData.dueDate,
        category: invoiceData.category,
        description: invoiceData.description,
        status: 'draft'
      });
      
      // Redirect back to invoice queue
      navigate('/accounting/invoice-queue');
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('An error occurred while creating the invoice');
    }
  };
  
  const handleCancel = () => {
    navigate('/accounting/invoice-queue');
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">
          {invoiceId ? 'Edit Invoice' : 'Create Invoice'}
        </h1>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{invoiceId ? 'Edit Invoice' : 'Create New Invoice'}</CardTitle>
            <CardDescription>
              {invoiceId 
                ? 'Update invoice details and account coding' 
                : 'Enter invoice details and assign account codes'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor*</Label>
                <Input 
                  id="vendor" 
                  name="vendor"
                  value={invoiceData.vendor}
                  onChange={handleInputChange}
                  placeholder="Enter vendor name"
                  required
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
                    value={invoiceData.amount}
                    onChange={handleInputChange}
                    className="rounded-l-none"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Invoice Date*</Label>
                <Input 
                  id="date" 
                  name="date"
                  type="date"
                  value={invoiceData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input 
                  id="dueDate" 
                  name="dueDate"
                  type="date"
                  value={invoiceData.dueDate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={invoiceData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="administration">Administration</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="landscaping">Landscaping</SelectItem>
                    <SelectItem value="taxes">Taxes</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  value={invoiceData.description}
                  onChange={handleInputChange}
                  placeholder="Enter invoice description"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="border-t pt-6">
              <div className="text-sm font-medium mb-4">GL Account Coding</div>
              
              <div className="bg-muted/30 p-4 rounded-md">
                <p className="text-sm text-muted-foreground">
                  Account coding section would be displayed here in a production environment. 
                  This would allow allocation of the invoice amount to different GL accounts.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {invoiceId ? 'Update Invoice' : 'Create Invoice'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default InvoiceCoding;
