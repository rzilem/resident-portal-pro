
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

interface PropertyOverviewReportProps {
  timeRange: string;
  association: string;
}

const PropertyOverviewReport = ({ timeRange, association }: PropertyOverviewReportProps) => {
  // Sample data for status distribution
  const statusData = [
    { name: 'Active', value: 72 },
    { name: 'Inactive', value: 8 },
    { name: 'Under Maintenance', value: 12 },
    { name: 'Vacant', value: 8 },
  ];

  const COLORS = ['#4ade80', '#f87171', '#facc15', '#60a5fa'];

  // Property types distribution
  const propertyTypeData = [
    { name: 'Single Family', count: 45 },
    { name: 'Townhouse', count: 30 },
    { name: 'Condo', count: 20 },
    { name: 'Apartment', count: 5 },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <div>
          <h4 className="text-base font-medium mb-4">Property Status Distribution</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Property Types */}
        <div>
          <h4 className="text-base font-medium mb-4">Property Types</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={propertyTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Number of Properties" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-muted/50 rounded-md">
        <h4 className="text-base font-medium mb-2">Property Portfolio Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm mb-2">
              The property portfolio consists of 100 properties across multiple associations, with the majority being single-family homes and townhouses. 72% of properties are currently active and occupied.
            </p>
            <p className="text-sm">
              The property maintenance schedule shows that 12% of properties are currently undergoing routine maintenance, which is within the expected quarterly target of 10-15%.
            </p>
          </div>
          <div>
            <h5 className="text-sm font-medium mb-2">Key Metrics</h5>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Properties:</span>
                <span className="text-sm font-medium">100</span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm text-muted-foreground">Average Property Age:</span>
                <span className="text-sm font-medium">14.5 years</span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm text-muted-foreground">Occupancy Rate:</span>
                <span className="text-sm font-medium">92%</span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm text-muted-foreground">Average Annual HOA Fee:</span>
                <span className="text-sm font-medium">$2,450</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyOverviewReport;
