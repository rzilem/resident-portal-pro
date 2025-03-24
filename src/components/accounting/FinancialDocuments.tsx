
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FileText } from "lucide-react";
import { FinancialDocument } from '@/components/settings/associations/types';
import DocumentTypeBadge from './documents/DocumentTypeBadge';
import DocumentFilters from './documents/DocumentFilters';
import DocumentActionButtons from './documents/DocumentActionButtons';
import DocumentTable from './documents/DocumentTable';
import DocumentTabs from './documents/DocumentTabs';

interface FinancialDocumentsProps {
  className?: string;
}

const FinancialDocuments: React.FC<FinancialDocumentsProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('all');
  
  const [documents, setDocuments] = useState<FinancialDocument[]>([
    {
      id: "DOC-001",
      title: "January 2023 Bank Statement",
      type: "statement",
      url: "#",
      uploadDate: "2023-02-05",
      associationId: "ASSOC-001",
      tags: ["bank", "statements", "2023"],
      metadata: { month: "January", year: "2023", accountNumber: "XXXX7890" }
    },
    {
      id: "DOC-002",
      title: "Q1 2023 Financial Report",
      type: "audit",
      url: "#",
      uploadDate: "2023-04-15",
      associationId: "ASSOC-001",
      tags: ["quarterly", "financial", "2023", "Q1"],
      metadata: { quarter: "Q1", year: "2023", preparedBy: "Smith Accounting" }
    },
    {
      id: "DOC-003",
      title: "Landscaping Services Invoice - June 2023",
      type: "invoice",
      url: "#",
      uploadDate: "2023-06-16",
      associationId: "ASSOC-001",
      tags: ["vendor", "invoice", "landscaping"],
      metadata: { vendor: "GreenScape Services", invoiceNumber: "GS-2023-125", amount: "$750.00" }
    },
    {
      id: "DOC-004",
      title: "Pool Maintenance Receipt - June 2023",
      type: "receipt",
      url: "#",
      uploadDate: "2023-06-20",
      associationId: "ASSOC-001",
      tags: ["vendor", "receipt", "pool"],
      metadata: { vendor: "Blue Waters Pool Co.", receiptNumber: "BW-2023-089", amount: "$450.00" }
    },
    {
      id: "DOC-005",
      title: "2022 Tax Return",
      type: "tax",
      url: "#",
      uploadDate: "2023-03-10",
      associationId: "ASSOC-001",
      tags: ["tax", "annual", "2022"],
      metadata: { year: "2022", preparedBy: "Smith Accounting", taxId: "XX-XXXXXX1" }
    }
  ]);
  
  // Map tab value to document type for filtering
  const typeMap: Record<string, string> = {
    'receipts': 'receipt',
    'invoices': 'invoice',
    'statements': 'statement',
    'tax': 'tax'
  };
  
  const getFilteredDocuments = (tabValue: string) => {
    if (tabValue === 'all') return documents;
    return documents.filter(doc => doc.type === typeMap[tabValue]);
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Financial Documents
        </CardTitle>
        <CardDescription>
          Store and manage financial records and documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 items-start sm:items-center">
            <DocumentTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <DocumentActionButtons />
          </div>
          
          <DocumentFilters />
          
          {['all', 'receipts', 'invoices', 'statements', 'tax'].map(tabValue => (
            <TabsContent key={tabValue} value={tabValue} className="m-0">
              <DocumentTable 
                documents={getFilteredDocuments(tabValue)} 
                caption={tabValue !== 'all' ? `Showing only ${tabValue}` : undefined}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FinancialDocuments;
