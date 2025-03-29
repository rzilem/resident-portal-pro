
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useDebounce } from './use-debounce';
import { Invoice } from '@/components/settings/associations/types';
import { InvoiceFilterState } from '@/components/settings/financial/payment-methods/types';

// Custom hook for managing invoice queue state and data fetching
export const useInvoiceQueue = (associationId?: string) => {
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filters, setFilters] = useState<InvoiceFilterState>({ isFiltered: false });

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
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // Generate mock invoices
        const mockInvoices = Array.from({ length: 25 }, (_, i) => {
          const invoice: Invoice = {
            id: `INV-${i + 1}`,
            invoiceNumber: `INV-${1000 + i}`,
            date: `2024-01-${String(i + 1).padStart(2, '0')}`,
            dueDate: `2024-02-${String(i + 1).padStart(2, '0')}`,
            amount: 100 + i * 10,
            status: ['draft', 'sent', 'overdue', 'paid'][i % 4],
            recipientId: `RECPT-${i % 5 + 1}`,
            recipientType: i % 2 === 0 ? 'vendor' : 'resident',
            vendorName: `Vendor ${i % 5 + 1}`,
            associationName: `Association ${i % 3 + 1}`,
            items: [
              {
                id: `ITEM-${i}-1`,
                description: `Service ${i + 1}`,
                quantity: 1,
                unitPrice: 100 + i * 10,
                total: 100 + i * 10,
                category: `Category ${i % 4 + 1}`
              }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          return invoice;
        });
        
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
    if (debouncedFilters.isFiltered) {
      if (debouncedFilters.status && debouncedFilters.status.length > 0) {
        filtered = filtered.filter(invoice => debouncedFilters.status?.includes(invoice.status));
      }
      
      if (debouncedFilters.query) {
        const query = debouncedFilters.query.toLowerCase();
        filtered = filtered.filter(invoice => 
          invoice.invoiceNumber.toLowerCase().includes(query) ||
          invoice.vendorName?.toLowerCase().includes(query) ||
          invoice.associationName?.toLowerCase().includes(query)
        );
      }
      
      if (debouncedFilters.dateRange?.from) {
        filtered = filtered.filter(invoice => new Date(invoice.date) >= debouncedFilters.dateRange!.from!);
      }
      
      if (debouncedFilters.dateRange?.to) {
        filtered = filtered.filter(invoice => new Date(invoice.date) <= debouncedFilters.dateRange!.to!);
      }
      
      if (debouncedFilters.minAmount !== undefined) {
        filtered = filtered.filter(invoice => invoice.amount >= debouncedFilters.minAmount!);
      }
      
      if (debouncedFilters.maxAmount !== undefined) {
        filtered = filtered.filter(invoice => invoice.amount <= debouncedFilters.maxAmount!);
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
      default:
        // Handle other actions like view, pay, etc.
        toast(`Action: ${action}`, {
          description: `Performed ${action} on invoice #${invoiceId}`
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
