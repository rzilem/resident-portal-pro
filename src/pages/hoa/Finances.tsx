
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Invoice {
  id: number;
  resident: string;
  amount: number;
  dueDate: string;
  status: "Pending" | "Paid" | "Overdue";
}

const Finances = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample invoice data
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 1, resident: 'John Doe - Unit 101', amount: 250, dueDate: '2025-04-01', status: 'Pending' },
    { id: 2, resident: 'Jane Smith - Unit 202', amount: 300, dueDate: '2025-03-30', status: 'Paid' },
    { id: 3, resident: 'Robert Johnson - Unit 303', amount: 275, dueDate: '2025-04-05', status: 'Pending' },
    { id: 4, resident: 'Emily Williams - Unit 104', amount: 250, dueDate: '2025-03-25', status: 'Overdue' },
    { id: 5, resident: 'Michael Brown - Unit 205', amount: 300, dueDate: '2025-04-10', status: 'Pending' },
  ]);

  // Financial summary data
  const summary = {
    totalCollected: '$5,250.00',
    outstandingBalance: '$4,325.00',
    upcomingExpenses: '$2,100.00'
  };

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(invoice => 
    invoice.resident.toLowerCase().includes(searchTerm.toLowerCase()) || 
    invoice.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "Financial report has been generated and is ready for download.",
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Finances</h1>
      
      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Collected</p>
              <FileText className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-600">{summary.totalCollected}</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Outstanding Balance</p>
              <FileText className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-red-500">{summary.outstandingBalance}</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Upcoming Expenses</p>
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{summary.upcomingExpenses}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Invoices */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Invoices</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search invoices..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4" />
              New Invoice
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-3 font-medium text-gray-600">Resident</th>
                  <th className="p-3 font-medium text-gray-600">Amount</th>
                  <th className="p-3 font-medium text-gray-600">Due Date</th>
                  <th className="p-3 font-medium text-gray-600">Status</th>
                  <th className="p-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{invoice.resident}</td>
                    <td className="p-3">${invoice.amount.toFixed(2)}</td>
                    <td className="p-3">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                          invoice.status === 'Overdue' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-gray-600">Showing {filteredInvoices.length} of {invoices.length} invoices</p>
            <Button 
              variant="default"
              onClick={handleGenerateReport}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Finances;
