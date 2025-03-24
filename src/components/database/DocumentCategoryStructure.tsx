
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FolderIcon } from 'lucide-react';

export const DOCUMENT_CATEGORIES = [
  { 
    id: 'bankStatements', 
    name: 'Bank Statements',
    description: 'Monthly statements from financial institutions',
    examples: ['January 2023 Statement.pdf', 'February 2023 Statement.pdf']
  },
  { 
    id: 'communityDocuments', 
    name: 'Community Documents',
    description: 'General community information and documents',
    examples: ['Welcome Packet.pdf', 'Community Rules.pdf']
  },
  { 
    id: 'communityMeetings', 
    name: 'Community Meetings',
    description: 'Meeting minutes, agendas, and related documents',
    examples: ['Annual Meeting 2023.pdf', 'Board Meeting March 2023.pdf']
  },
  { 
    id: 'financials', 
    name: 'Financials',
    description: 'Financial records, budgets, and reports',
    examples: ['2023 Annual Budget.xlsx', 'Q1 Financial Report.pdf']
  },
  { 
    id: 'forms', 
    name: 'Forms',
    description: 'Common forms for residents and management',
    examples: ['Architectural Request.pdf', 'Maintenance Request.pdf']
  },
  { 
    id: 'invoiceImages', 
    name: 'Invoice Images',
    description: 'Scanned copies of vendor invoices',
    examples: ['Landscaping Invoice 2023-05.pdf', 'Plumbing Invoice 2023-06.pdf']
  },
  { 
    id: 'leases', 
    name: 'Leases',
    description: 'Resident lease agreements',
    examples: ['Unit 101 Lease.pdf', 'Unit 202 Lease.pdf']
  },
  { 
    id: 'maintenance', 
    name: 'Maintenance',
    description: 'Maintenance requests and records',
    examples: ['HVAC Service Report.pdf', 'Annual Inspection Report.pdf']
  },
  { 
    id: 'monthlyFinancialReports', 
    name: 'Monthly Financial Reports',
    description: 'Monthly financial statements and reports',
    examples: ['January 2023 Financial Report.pdf', 'February 2023 Financial Report.pdf']
  },
  { 
    id: 'violations', 
    name: 'Violations',
    description: 'Violation notices and documentation',
    examples: ['Parking Violation Notice.pdf', 'Noise Complaint.pdf']
  },
];

/**
 * Component to display information about document categories
 */
const DocumentCategoryStructure = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Categories Structure</CardTitle>
        <CardDescription>
          This structure will be created for each association to organize and store documents.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-auto max-h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Example Documents</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DOCUMENT_CATEGORIES.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FolderIcon className="h-5 w-5 text-yellow-400" />
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <ul className="list-disc pl-4 text-sm text-muted-foreground">
                      {category.examples.map((example, index) => (
                        <li key={index}>{example}</li>
                      ))}
                    </ul>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCategoryStructure;
