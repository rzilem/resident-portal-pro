
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  File, 
  FileText,
  FilePlus,
  Search,
  Filter,
  Download,
  Upload,
  FileImage,
  FileCheck,
  Calculator,
  FileBarChart2,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FinancialDocument } from '@/components/settings/associations/types';

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
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'receipt':
        return <FileCheck size={16} />;
      case 'invoice':
        return <FileText size={16} />;
      case 'statement':
        return <FileBarChart2 size={16} />;
      case 'tax':
        return <Calculator size={16} />;
      case 'audit':
        return <FileImage size={16} />;
      default:
        return <File size={16} />;
    }
  };
  
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'receipt':
        return <Badge className="bg-green-500 flex items-center gap-1"><FileCheck size={14} /> Receipt</Badge>;
      case 'invoice':
        return <Badge className="bg-blue-500 flex items-center gap-1"><FileText size={14} /> Invoice</Badge>;
      case 'statement':
        return <Badge className="bg-purple-500 flex items-center gap-1"><FileBarChart2 size={14} /> Statement</Badge>;
      case 'tax':
        return <Badge className="bg-red-500 flex items-center gap-1"><Calculator size={14} /> Tax</Badge>;
      case 'audit':
        return <Badge className="bg-yellow-500 flex items-center gap-1"><FileImage size={14} /> Audit</Badge>;
      default:
        return <Badge className="flex items-center gap-1"><File size={14} /> {type}</Badge>;
    }
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
            <TabsList>
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="receipts" className="flex items-center gap-1">
                <FileCheck size={14} /> Receipts
              </TabsTrigger>
              <TabsTrigger value="invoices" className="flex items-center gap-1">
                <FileText size={14} /> Invoices
              </TabsTrigger>
              <TabsTrigger value="statements" className="flex items-center gap-1">
                <FileBarChart2 size={14} /> Statements
              </TabsTrigger>
              <TabsTrigger value="tax" className="flex items-center gap-1">
                <Calculator size={14} /> Tax
              </TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download size={16} /> Download
              </Button>
              <Button size="sm" className="flex items-center gap-1">
                <Upload size={16} /> Upload Document
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input 
                  placeholder="Search documents..." 
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 pl-8 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter size={16} />
              </Button>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="bank">Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value="all" className="m-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map(document => (
                    <TableRow key={document.id}>
                      <TableCell className="font-medium">{document.id}</TableCell>
                      <TableCell>{document.title}</TableCell>
                      <TableCell>{getTypeBadge(document.type)}</TableCell>
                      <TableCell>{new Date(document.uploadDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {document.tags?.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="outline" size="sm">Download</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Filter for other tab values */}
          {['receipts', 'invoices', 'statements', 'tax'].map(tabValue => {
            // Map tab value to document type
            const typeMap: Record<string, string> = {
              'receipts': 'receipt',
              'invoices': 'invoice',
              'statements': 'statement',
              'tax': 'tax'
            };
            
            return (
              <TabsContent key={tabValue} value={tabValue} className="m-0">
                <div className="rounded-md border">
                  <Table>
                    <TableCaption>
                      {`Showing only ${tabValue}`}
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Upload Date</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents
                        .filter(doc => doc.type === typeMap[tabValue])
                        .map(document => (
                          <TableRow key={document.id}>
                            <TableCell className="font-medium">{document.id}</TableCell>
                            <TableCell>{document.title}</TableCell>
                            <TableCell>{getTypeBadge(document.type)}</TableCell>
                            <TableCell>{new Date(document.uploadDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {document.tags?.map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="sm">View</Button>
                                <Button variant="outline" size="sm">Download</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FinancialDocuments;
