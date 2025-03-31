
import { toast } from 'sonner';

// Types for accounting service
export interface Invoice {
  id: string;
  number: string;
  vendor: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'draft' | 'pending' | 'approved' | 'paid' | 'void';
  category?: string;
  description?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  category: string;
  account: string;
  reference?: string;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
  description?: string;
  payer?: string;
}

// Sample data functions
export function getInvoices(): Promise<Invoice[]> {
  // Mock data - in a real app, this would fetch from your API
  return Promise.resolve([
    {
      id: '1',
      number: 'INV-1001',
      vendor: 'Acme Landscaping',
      date: '2023-06-01',
      dueDate: '2023-07-01',
      amount: 1250.00,
      status: 'paid',
      category: 'Landscaping',
      description: 'Monthly landscaping services'
    },
    {
      id: '2',
      number: 'INV-1002',
      vendor: 'City Water Utility',
      date: '2023-06-05',
      dueDate: '2023-06-25',
      amount: 875.50,
      status: 'pending',
      category: 'Utilities',
      description: 'Water services for June'
    },
    {
      id: '3',
      number: 'INV-1003',
      vendor: 'Sunrise Cleaning',
      date: '2023-06-10',
      dueDate: '2023-07-10',
      amount: 450.00,
      status: 'draft',
      category: 'Cleaning',
      description: 'Common area cleaning'
    },
    {
      id: '4',
      number: 'INV-1004',
      vendor: 'SecureGuard Systems',
      date: '2023-06-15',
      dueDate: '2023-07-15',
      amount: 325.00,
      status: 'approved',
      category: 'Security',
      description: 'Monthly security system fee'
    }
  ]);
}

export function createInvoice(invoice: Partial<Invoice>): Promise<Invoice> {
  // Mock implementation - in a real app this would send data to your API
  console.log('Creating invoice:', invoice);
  
  // Create a new invoice with default values for missing fields
  const newInvoice: Invoice = {
    id: crypto.randomUUID(),
    number: invoice.number || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    vendor: invoice.vendor || '',
    date: invoice.date || new Date().toISOString().split('T')[0],
    dueDate: invoice.dueDate || '',
    amount: invoice.amount || 0,
    status: invoice.status || 'draft',
    category: invoice.category,
    description: invoice.description
  };
  
  toast.success('Invoice created successfully');
  return Promise.resolve(newInvoice);
}

export function approveInvoice(id: string): Promise<boolean> {
  console.log('Approving invoice:', id);
  toast.success('Invoice approved successfully');
  return Promise.resolve(true);
}

export function voidInvoice(id: string): Promise<boolean> {
  console.log('Voiding invoice:', id);
  toast.success('Invoice voided successfully');
  return Promise.resolve(true);
}

export function getTransactions(): Promise<Transaction[]> {
  // Mock data - in a real app, this would fetch from your API
  return Promise.resolve([
    {
      id: '1',
      date: '2023-06-01',
      description: 'Landscaping payment',
      amount: 1250.00,
      type: 'debit',
      category: 'Maintenance',
      account: 'Operating Account'
    },
    {
      id: '2',
      date: '2023-06-05',
      description: 'Member assessment',
      amount: 350.00,
      type: 'credit',
      category: 'Revenue',
      account: 'Receivables',
      reference: 'MEMBER-101'
    },
    {
      id: '3',
      date: '2023-06-10',
      description: 'Cleaning services',
      amount: 450.00,
      type: 'debit',
      category: 'Maintenance',
      account: 'Operating Account'
    },
    {
      id: '4',
      date: '2023-06-15',
      description: 'Member assessment',
      amount: 350.00,
      type: 'credit',
      category: 'Revenue',
      account: 'Receivables',
      reference: 'MEMBER-102'
    }
  ]);
}

export function getPayments(): Promise<Payment[]> {
  // Mock data - in a real app, this would fetch from your API
  return Promise.resolve([
    {
      id: '1',
      date: '2023-06-02',
      amount: 350.00,
      method: 'Credit Card',
      status: 'completed',
      reference: 'PAYMENT-1001',
      description: 'Monthly assessment',
      payer: 'John Smith'
    },
    {
      id: '2',
      date: '2023-06-05',
      amount: 350.00,
      method: 'ACH',
      status: 'completed',
      reference: 'PAYMENT-1002',
      description: 'Monthly assessment',
      payer: 'Jane Doe'
    },
    {
      id: '3',
      date: '2023-06-10',
      amount: 350.00,
      method: 'Check',
      status: 'pending',
      reference: 'PAYMENT-1003',
      description: 'Monthly assessment',
      payer: 'Robert Johnson'
    },
    {
      id: '4',
      date: '2023-06-15',
      amount: 350.00,
      method: 'Credit Card',
      status: 'failed',
      reference: 'PAYMENT-1004',
      description: 'Monthly assessment',
      payer: 'Maria Garcia'
    }
  ]);
}

export function recordPayment(payment: Partial<Payment>): Promise<Payment> {
  // Mock implementation
  console.log('Recording payment:', payment);
  
  const newPayment: Payment = {
    id: crypto.randomUUID(),
    date: payment.date || new Date().toISOString().split('T')[0],
    amount: payment.amount || 0,
    method: payment.method || 'Credit Card',
    status: payment.status || 'completed',
    reference: payment.reference || `PAYMENT-${Math.floor(1000 + Math.random() * 9000)}`,
    description: payment.description,
    payer: payment.payer
  };
  
  toast.success('Payment recorded successfully');
  return Promise.resolve(newPayment);
}

export const accountingService = {
  getInvoices,
  createInvoice,
  approveInvoice,
  voidInvoice,
  getTransactions,
  getPayments,
  recordPayment
};
