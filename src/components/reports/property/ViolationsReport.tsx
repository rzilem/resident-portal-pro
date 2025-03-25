
import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { PropertyColumn } from '@/components/properties/PropertyColumnsSelector';
import { 
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface ViolationsReportProps {
  timeRange: string;
  association: string;
  onExport: (columns: PropertyColumn[]) => void;
}

const ViolationsReport = ({ timeRange, association, onExport }: ViolationsReportProps) => {
  // Violation data
  const violationData = [
    { id: 'V-2301', property: 'Oakwood Residence', type: 'Lawn Maintenance', status: 'Open', reportDate: '2023-06-10', dueDate: '2023-06-25' },
    { id: 'V-2302', property: 'Willow Heights', type: 'Unauthorized Structure', status: 'Closed', reportDate: '2023-05-15', dueDate: '2023-05-30' },
    { id: 'V-2303', property: 'Cedar Point', type: 'Parking Violation', status: 'Open', reportDate: '2023-07-02', dueDate: '2023-07-17' },
    { id: 'V-2304', property: 'Maple Grove', type: 'Exterior Maintenance', status: 'In Progress', reportDate: '2023-06-20', dueDate: '2023-07-05' },
    { id: 'V-2305', property: 'Birchwood Court', type: 'Noise Complaint', status: 'Closed', reportDate: '2023-06-25', dueDate: '2023-07-10' },
    { id: 'V-2306', property: 'Pine Valley', type: 'Pet Violation', status: 'Open', reportDate: '2023-07-05', dueDate: '2023-07-20' },
  ];

  const COLORS = ['#4ade80', '#f87171', '#facc15', '#60a5fa'];

  // Default columns for exporting
  const defaultColumns: PropertyColumn[] = [
    { id: 'name', label: 'Property Name', checked: true },
    { id: 'location', label: 'Location', checked: true },
    { id: 'status', label: 'Status', checked: true },
  ];

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          Violations Report
          <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </h3>
        <Button variant="outline" size="sm" onClick={() => onExport(defaultColumns)}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Violation ID</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Violation Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Report Date</TableHead>
            <TableHead>Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {violationData.map((violation) => (
            <TableRow key={violation.id}>
              <TableCell className="font-medium">{violation.id}</TableCell>
              <TableCell>{violation.property}</TableCell>
              <TableCell>{violation.type}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  violation.status === 'Closed' ? 'bg-green-100 text-green-800' : 
                  violation.status === 'In Progress' ? 'bg-amber-100 text-amber-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {violation.status}
                </span>
              </TableCell>
              <TableCell>{formatDate(violation.reportDate)}</TableCell>
              <TableCell>{formatDate(violation.dueDate)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-base font-medium mb-4">Violation Types</h4>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Lawn Maintenance', value: 35 },
                    { name: 'Exterior Maintenance', value: 25 },
                    { name: 'Parking Violations', value: 20 },
                    { name: 'Unauthorized Structures', value: 15 },
                    { name: 'Other', value: 5 },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {violationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-base font-medium">Violation Statistics</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h4 className="text-sm font-medium">Total Violations</h4>
                <p className="text-2xl font-bold mt-1">24</p>
                <p className="text-xs text-red-600 mt-1">+15% from last quarter</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h4 className="text-sm font-medium">Resolution Rate</h4>
                <p className="text-2xl font-bold mt-1">67%</p>
                <p className="text-xs text-green-600 mt-1">+7% from last quarter</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-md">
            <h4 className="text-sm font-medium mb-2">Key Insights</h4>
            <ul className="space-y-1 text-sm">
              <li>• Lawn maintenance remains the most common violation</li>
              <li>• Average time to resolution: 15 days</li>
              <li>• 20% of violations required board involvement</li>
              <li>• 5% of violations resulted in fines</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViolationsReport;
