
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Finances = () => {
  const finances = [
    { id: 1, resident: 'John Doe', amount: 250, dueDate: '2025-04-01', status: 'Pending' },
    { id: 2, resident: 'Jane Smith', amount: 300, dueDate: '2025-03-30', status: 'Paid' },
    { id: 3, resident: 'Robert Johnson', amount: 250, dueDate: '2025-04-05', status: 'Pending' },
    { id: 4, resident: 'Maria Garcia', amount: 300, dueDate: '2025-03-25', status: 'Paid' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Finances</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Assessment Invoices</CardTitle>
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
                {finances.map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{invoice.resident}</td>
                    <td className="p-3">${invoice.amount}</td>
                    <td className="p-3">{invoice.dueDate}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Finances;
