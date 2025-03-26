
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FileText } from "lucide-react";
import { Invoice } from '@/components/settings/associations/types';
import InvoiceFilters from './invoices/InvoiceFilters';
import InvoiceActionButtons from './invoices/InvoiceActionButtons';
import InvoiceTabs from './invoices/InvoiceTabs';
import InvoiceTabContent from './invoices/InvoiceTabContent';
import InvoiceColumnsSelector, { InvoiceColumn } from './invoices/InvoiceColumnsSelector';
import { useSettings } from '@/hooks/use-settings';

interface InvoiceQueueProps {
  className?: string;
  associationId?: string;
}

const InvoiceQueue: React.FC<InvoiceQueueProps> = ({ className, associationId }) => {
  const [activeTab, setActiveTab] = useState('all');
  const { preferences, updatePreference } = useSettings();
  
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
  
  const handleColumnsChange = (updatedColumns: InvoiceColumn[]) => {
    setColumns(updatedColumns);
    updatePreference('invoiceTableColumns', updatedColumns);
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
          
          <InvoiceFilters />
          
          {/* All Invoices Tab */}
          <TabsContent value="all" className="m-0">
            <InvoiceTabContent 
              invoices={invoices} 
              columns={columns}
            />
          </TabsContent>
          
          {/* Draft Invoices Tab */}
          <TabsContent value="draft" className="m-0">
            <InvoiceTabContent 
              invoices={invoices} 
              status="draft" 
              showCaption={true} 
              columns={columns}
            />
          </TabsContent>
          
          {/* Sent Invoices Tab */}
          <TabsContent value="sent" className="m-0">
            <InvoiceTabContent 
              invoices={invoices} 
              status="sent" 
              showCaption={true} 
              columns={columns}
            />
          </TabsContent>
          
          {/* Overdue Invoices Tab */}
          <TabsContent value="overdue" className="m-0">
            <InvoiceTabContent 
              invoices={invoices} 
              status="overdue" 
              showCaption={true} 
              columns={columns}
            />
          </TabsContent>
          
          {/* Paid Invoices Tab */}
          <TabsContent value="paid" className="m-0">
            <InvoiceTabContent 
              invoices={invoices} 
              status="paid" 
              showCaption={true} 
              columns={columns}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InvoiceQueue;
