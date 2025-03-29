import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { Invoice } from '@/components/settings/associations/types';
import { useDebounce } from './use-debounce';

// Define filter type
export interface InvoiceFilter {
  status?: string;
  vendor?: string;
  association?: string;
  dateFrom?: Date | null;
  dateTo?: Date | null;
  amountMin?: number | null;
  amountMax?: number | null;
}

// Custom hook for managing invoice queue state and data fetching
export const useInvoiceQueue = (associationId?: string) => {
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filters, setFilters] = useState<InvoiceFilter>({});
  
  // Mock functions for invoice actions
  const approveInvoice = (invoiceId: string) => {
    console.log(`Invoice ${invoiceId} approved`);
  };
  
  const rejectInvoice = (invoiceId: string) => {
    console.log(`Invoice ${invoiceId} rejected`);
  };
  
  const deleteInvoice = (invoiceId: string) => {
    console.log(`Invoice ${invoiceId} deleted`);
  };
  
  // Fetch invoices (mock data for now)
  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate mock invoices
        const mockInvoices: Invoice[] = Array.from({ length: 25 }, (_, i) => ({
          id: `INV-${i + 1}`,
          invoiceNumber: 1000 + i,
          date: new Date(2024, 0, i + 1),
          dueDate: new Date(2024, 1, i + 1),
          vendor: `Vendor ${i % 5 + 1}`,
          association: `Association ${i % 3 + 1}`,
          amount: 100 + i * 10,
          status: ['draft', 'sent', 'overdue', 'paid'][i % 4],
          recipient: `Recipient ${i % 5 + 1}`,
          category: `Category ${i % 4 + 1}`,
          createdAt: new Date(),
        }));
        
        setInvoices(mockInvoices);
      } catch (err) {
        setError('Failed to fetch invoices');
        console.error("Error fetching invoices:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvoices();
  }, [associationId]);
  
  // Debounce filter changes
  const debouncedFilters = useDebounce(filters, 300);
  
  // Filter invoices based on active tab and filters
  const filteredInvoices = useMemo(() => {
    let filtered = invoices;
    
    // Apply tab filter
    if (activeTab !== 'all') {
      filtered = invoices.filter(invoice => invoice.status === activeTab);
    }
    
    // Apply other filters
    if (debouncedFilters) {
      if (debouncedFilters.status) {
        filtered = filtered.filter(invoice => invoice.status === debouncedFilters.status);
      }
      if (debouncedFilters.vendor) {
        filtered = filtered.filter(invoice =>
          invoice.vendor.toLowerCase().includes(debouncedFilters.vendor.toLowerCase())
        );
      }
      if (debouncedFilters.association) {
        filtered = filtered.filter(invoice =>
          invoice.association.toLowerCase().includes(debouncedFilters.association.toLowerCase())
        );
      }
      if (debouncedFilters.dateFrom) {
        filtered = filtered.filter(invoice => invoice.date >= debouncedFilters.dateFrom!);
      }
      if (debouncedFilters.dateTo) {
        filtered = filtered.filter(invoice => invoice.date <= debouncedFilters.dateTo!);
      }
      if (debouncedFilters.amountMin) {
        filtered = filtered.filter(invoice => invoice.amount >= debouncedFilters.amountMin!);
      }
      if (debouncedFilters.amountMax) {
        filtered = filtered.filter(invoice => invoice.amount <= debouncedFilters.amountMax!);
      }
    }
    
    return filtered;
  }, [invoices, activeTab, debouncedFilters]);
  
  const handleInvoiceAction = (action: string, invoiceId: string) => {
    switch (action) {
      case 'approve':
        approveInvoice(invoiceId);
        toast("Invoice approved", {
          description: `Invoice #${invoiceId} has been approved.`
        });
        break;
      case 'reject':
        rejectInvoice(invoiceId);
        toast("Invoice rejected", {
          description: `Invoice #${invoiceId} has been rejected.`
        });
        break;
      case 'delete':
        deleteInvoice(invoiceId);
        toast("Invoice deleted", {
          description: `Invoice #${invoiceId} has been deleted.`
        });
        break;
    }
  };
  
  return {
    activeTab,
    setActiveTab,
    loading,
    error,
    filters,
    setFilters,
    filteredInvoices,
    handleInvoiceAction
  };
};
