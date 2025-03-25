
import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PropertyColumn } from '@/components/properties/PropertyColumnsSelector';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface WorkOrderReportProps {
  timeRange: string;
  association: string;
  onExport: (columns: PropertyColumn[]) => void;
}

const WorkOrderReport = ({ timeRange, association, onExport }: WorkOrderReportProps) => {
  // Work order summary data
  const workOrderData = [
    { month: 'Jan', completed: 15, pending: 3 },
    { month: 'Feb', completed: 18, pending: 4 },
    { month: 'Mar', completed: 20, pending: 2 },
    { month: 'Apr', completed: 22, pending: 5 },
    { month: 'May', completed: 24, pending: 3 },
    { month: 'Jun', completed: 26, pending: 4 },
    { month: 'Jul', completed: 23, pending: 6 },
  ];

  // Default columns for exporting
  const defaultColumns: PropertyColumn[] = [
    { id: 'name', label: 'Property Name', checked: true },
    { id: 'location', label: 'Location', checked: true },
    { id: 'workOrder', label: 'Work Order', checked: true },
    { id: 'status', label: 'Status', checked: true },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          Work Order Summary
          <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </h3>
        <Button variant="outline" size="sm" onClick={() => onExport(defaultColumns)}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
      
      <div className="h-[350px] mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={workOrderData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" name="Completed Work Orders" fill="#4ade80" />
            <Bar dataKey="pending" name="Pending Work Orders" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium">Total Work Orders</h4>
            <p className="text-2xl font-bold mt-1">148</p>
            <p className="text-xs text-muted-foreground mt-1">Year to date</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium">Completion Rate</h4>
            <p className="text-2xl font-bold mt-1">85%</p>
            <p className="text-xs text-green-600 mt-1">+3% from last year</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium">Avg. Completion Time</h4>
            <p className="text-2xl font-bold mt-1">4.2 days</p>
            <p className="text-xs text-green-600 mt-1">-0.8 days from last year</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-muted/50 rounded-md">
          <h4 className="text-base font-medium mb-2">Work Order Categories</h4>
          <div className="space-y-3">
            {[
              { category: 'Plumbing', count: 42, percentage: 28 },
              { category: 'Electrical', count: 35, percentage: 24 },
              { category: 'HVAC', count: 28, percentage: 19 },
              { category: 'Landscaping', count: 25, percentage: 17 },
              { category: 'Other', count: 18, percentage: 12 },
            ].map((item) => (
              <div key={item.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.category}</span>
                  <span>{item.count} ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-primary" 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 bg-muted/50 rounded-md">
          <h4 className="text-base font-medium mb-2">Work Order Insights</h4>
          <ul className="space-y-1 text-sm">
            <li>• Service provider responsiveness has improved by 15%</li>
            <li>• Emergency work orders decreased by 8% compared to last quarter</li>
            <li>• Preventative maintenance requests increased by 12%</li>
            <li>• Cost per work order decreased by 5% due to new vendor contracts</li>
            <li>• Resident satisfaction with maintenance increased to 92%</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WorkOrderReport;
