
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FileText, AlertTriangle } from "lucide-react";
import { Invoice } from '@/components/settings/associations/types';
import { toast } from "@/components/ui/use-toast";
import InvoiceFilters from './invoices/InvoiceFilters';
import InvoiceActionButtons from './invoices/InvoiceActionButtons';
import InvoiceTabs from './invoices/InvoiceTabs';
import InvoiceTabContent from './invoices/InvoiceTabContent';
import InvoiceColumnsSelector, { InvoiceColumn } from './invoices/InvoiceColumnsSelector';
import { useSettings } from '@/hooks/use-settings';
import { InvoiceFilterState } from '@/components/settings/financial/payment-methods/types';
import { format } from 'date-fns';

interface InvoiceQueueProps {
  className?: string;
  associationId?: string;
}

const InvoiceQueue: React.FC<InvoiceQueueProps> = ({ className, associationId }) => {
  const [activeTab, setActiveTab] = useState('all');
  const { preferences, updatePreference } = useSettings();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Define default columns
  const defaultColumns: InvoiceColumn[] = [
    { id: 'invoiceNumber', label: 'Invoice #', checked: true },
    { id: 'date', label: 'Date', checked: true },
    { id: 'dueDate', label: 'Due Date', checked: true },
    { id: 'vendor', label: 'Vendor', checked: true },
    { id: 'association', label: 'Association', checked: true },
    { id: 'amount', label: 'Amount', checked: true },
    { id: 'status', label: 'Status', checked: true },
    { id: 'recipient', label: 'Recipient', checked: false },
    { id: 'category', label: 'Category', checked: false },
    { id: 'createdAt', label: 'Created', checked: false }
  ];
  
  // Load columns from user preferences or use defaults
  const [columns, setColumns] = useState<InvoiceColumn[]>(
    preferences?.invoiceTableColumns || defaultColumns
  );
  
  const [filters, setFilters] = useState<InvoiceFilterState>({
    isFiltered: false
  });
  
  const handleColumnsChange = (updatedColumns: InvoiceColumn[]) => {
    setColumns(updatedColumns);
    updatePreference('invoiceTableColumns', updatedColumns);
    toast({
      title: "Column preferences saved",
      description: "Your invoice table column preferences have been updated."
    });
  };
  
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
      vendorName: "N/A",
      associationName: "Evergreen HOA",
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
      vendorName: "N/A",
      associationName: "Sunset Estates",
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
      vendorName: "N/A",
      associationName: "Mountain View",
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
      vendorName: "Evergreen Landscaping",
      associationName: "Lakeside Community",
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

  // Generate 10 more random invoices for better demo content
  useEffect(() => {
    const generateRandomInvoices = () => {
      const statuses = ['draft', 'sent', 'paid', 'overdue'];
      const vendors = ['ABC Maintenance', 'City Water Services', 'Elite Security', 'Green Landscaping', 'Tech Solutions'];
      const associations = ['Evergreen HOA', 'Sunset Estates', 'Mountain View', 'Lakeside Community', 'Oak Meadows'];
      const categories = ['maintenance', 'utilities', 'security', 'landscaping', 'technology', 'administrative'];
      
      const newInvoices: Invoice[] = [];
      
      for (let i = 0; i < 10; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 60));
        
        const dueDate = new Date(date);
        dueDate.setDate(date.getDate() + 30);
        
        const amount = Math.floor(Math.random() * 1000) + 100;
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const vendor = vendors[Math.floor(Math.random() * vendors.length)];
        const association = associations[Math.floor(Math.random() * associations.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];
        
        newInvoices.push({
          id: `INV-00${i + 5}`,
          invoiceNumber: `INV2023-00${i + 5}`,
          date: format(date, 'yyyy-MM-dd'),
          dueDate: format(dueDate, 'yyyy-MM-dd'),
          amount: amount,
          status: status,
          recipientId: `VEN-00${i + 2}`,
          recipientType: Math.random() > 0.5 ? 'vendor' : 'resident',
          vendorName: vendor,
          associationName: association,
          items: [
            {
              id: `ITEM-00${i + 7}`,
              description: `${category.charAt(0).toUpperCase() + category.slice(1)} service`,
              quantity: 1,
              unitPrice: amount,
              total: amount,
              category: category
            }
          ],
          createdAt: date.toISOString(),
          updatedAt: date.toISOString()
        });
      }
      
      return newInvoices;
    };
    
    setInvoices(prevInvoices => [...prevInvoices, ...generateRandomInvoices()]);
  }, []);
  
  // Filter invoices based on current filters
  const filteredInvoices = invoices.filter(invoice => {
    if (!filters.isFiltered) return true;
    
    // Search query filtering
    if (filters.query && !invoice.invoiceNumber.toLowerCase().includes(filters.query.toLowerCase()) &&
        !invoice.vendorName?.toLowerCase().includes(filters.query.toLowerCase()) &&
        !invoice.associationName?.toLowerCase().includes(filters.query.toLowerCase())) {
      return false;
    }
    
    // Date range filtering
    if (filters.dateRange?.from && new Date(invoice.date) < filters.dateRange.from) {
      return false;
    }
    
    if (filters.dateRange?.to && new Date(invoice.date) > filters.dateRange.to) {
      return false;
    }
    
    // Status filtering
    if (filters.status && filters.status.length > 0 && !filters.status.includes(invoice.status)) {
      return false;
    }
    
    // Amount filtering
    if (filters.minAmount !== undefined && invoice.amount < filters.minAmount) {
      return false;
    }
    
    if (filters.maxAmount !== undefined && invoice.amount > filters.maxAmount) {
      return false;
    }
    
    return true;
  });

  // Handle invoice actions like pay, view, etc.
  const handleInvoiceAction = (action: string, invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;
    
    switch (action) {
      case 'view':
        toast({
          title: "Viewing Invoice",
          description: `Viewing details for invoice ${invoice.invoiceNumber}`
        });
        break;
      case 'pay':
        toast({
          title: "Processing Payment",
          description: `Initiating payment process for invoice ${invoice.invoiceNumber}`
        });
        // Update status if paying
        const updatedInvoices = invoices.map(inv => 
          inv.id === invoiceId ? { ...inv, status: 'paid' } : inv
        );
        setInvoices(updatedInvoices);
        break;
      case 'delete':
        toast({
          title: "Invoice Deleted",
          description: `Invoice ${invoice.invoiceNumber} has been removed`
        });
        setInvoices(invoices.filter(inv => inv.id !== invoiceId));
        break;
      default:
        break;
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Association Payment Queue
        </CardTitle>
        <CardDescription>
          Manage and process vendor payments on behalf of associations
          {associationId && <span className="ml-1">for the selected association</span>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 items-start sm:items-center">
            <InvoiceTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="flex items-center gap-2">
              <InvoiceColumnsSelector 
                columns={columns} 
                onChange={handleColumnsChange} 
              />
              <InvoiceActionButtons />
            </div>
          </div>
          
          <InvoiceFilters 
            filters={filters} 
            onFilterChange={setFilters} 
          />
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center mb-4">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          )}
          
          {/* All Invoices Tab */}
          <TabsContent value="all" className="m-0">
            <InvoiceTabContent 
              invoices={filteredInvoices} 
              columns={columns}
              onAction={handleInvoiceAction}
              loading={loading}
            />
          </TabsContent>
          
          {/* Draft Invoices Tab */}
          <TabsContent value="draft" className="m-0">
            <InvoiceTabContent 
              invoices={filteredInvoices} 
              status="draft" 
              showCaption={true} 
              columns={columns}
              onAction={handleInvoiceAction}
              loading={loading}
            />
          </TabsContent>
          
          {/* Sent Invoices Tab */}
          <TabsContent value="sent" className="m-0">
            <InvoiceTabContent 
              invoices={filteredInvoices} 
              status="sent" 
              showCaption={true} 
              columns={columns}
              onAction={handleInvoiceAction}
              loading={loading}
            />
          </TabsContent>
          
          {/* Overdue Invoices Tab */}
          <TabsContent value="overdue" className="m-0">
            <InvoiceTabContent 
              invoices={filteredInvoices} 
              status="overdue" 
              showCaption={true} 
              columns={columns}
              onAction={handleInvoiceAction}
              loading={loading}
            />
          </TabsContent>
          
          {/* Paid Invoices Tab */}
          <TabsContent value="paid" className="m-0">
            <InvoiceTabContent 
              invoices={filteredInvoices} 
              status="paid" 
              showCaption={true} 
              columns={columns}
              onAction={handleInvoiceAction}
              loading={loading}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InvoiceQueue;
