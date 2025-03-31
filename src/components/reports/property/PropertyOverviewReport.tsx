
import React, { useEffect, useState } from 'react';
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
import { sampleReportDataService } from '@/services/SampleReportDataService';

interface PropertyOverviewReportProps {
  timeRange: string;
  association: string;
}

const PropertyOverviewReport = ({ timeRange, association }: PropertyOverviewReportProps) => {
  const [reportData, setReportData] = useState<any>(null);
  
  useEffect(() => {
    // Get sample data from our service
    const data = sampleReportDataService.getPropertyData('overview', association);
    setReportData(data);
  }, [association, timeRange]);
  
  if (!reportData) {
    return <div className="animate-pulse p-6 text-center">Loading property data...</div>;
  }

  // Calculate status distribution based on properties data
  const calculateStatusDistribution = () => {
    const statusCounts: { [key: string]: number } = { 
      Active: 0, 
      Inactive: 0, 
      'Under Maintenance': 0, 
      Vacant: 0 
    };
    
    // Count statuses
    reportData.forEach((property: any) => {
      if (property.status === 'Active') {
        statusCounts.Active += 1;
      } else if (property.status === 'Inactive') {
        statusCounts.Inactive += 1;
      } else {
        // Add some variety for the visualization
        statusCounts['Under Maintenance'] += Math.floor(Math.random() * 2);
        statusCounts.Vacant += Math.floor(Math.random() * 2);
      }
    });
    
    // Make sure we have some values for demo purposes
    if (statusCounts['Under Maintenance'] === 0) statusCounts['Under Maintenance'] = 1;
    if (statusCounts.Vacant === 0) statusCounts.Vacant = 1;
    
    // Convert to array format for chart
    return Object.keys(statusCounts).map(status => ({
      name: status,
      value: statusCounts[status]
    }));
  };
  
  // Create distribution by property type
  const calculatePropertyTypeDistribution = () => {
    const typeCounts: { [key: string]: number } = {
      'Single Family': 0,
      'Townhouse': 0,
      'Condo': 0,
      'Apartment': 0
    };
    
    // For demo purposes, we'll distribute based on ID
    reportData.forEach((property: any, index: number) => {
      if (index % 4 === 0) {
        typeCounts['Single Family'] += 1;
      } else if (index % 4 === 1) {
        typeCounts['Townhouse'] += 1;
      } else if (index % 4 === 2) {
        typeCounts['Condo'] += 1;
      } else {
        typeCounts['Apartment'] += 1;
      }
    });
    
    // Make sure we have at least some of each type for demo
    Object.keys(typeCounts).forEach(type => {
      if (typeCounts[type] === 0) typeCounts[type] = 1;
    });
    
    // Convert to array format for chart
    return Object.keys(typeCounts).map(type => ({
      name: type,
      count: typeCounts[type]
    }));
  };

  const COLORS = ['#4ade80', '#f87171', '#facc15', '#60a5fa'];
  const statusData = calculateStatusDistribution();
  const propertyTypeData = calculatePropertyTypeDistribution();
  
  const totalProperties = reportData.length;
  const avgPropertyAge = 14.5; // Sample value
  const occupancyRate = 92; // Sample value
  const avgAnnualFee = Math.round(
    reportData.reduce((sum: number, property: any) => sum + property.annualFees, 0) / totalProperties
  );

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
                <Tooltip formatter={(value) => `${value} properties`} />
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
              The property portfolio consists of {totalProperties} properties across multiple associations, with the majority being single-family homes and townhouses. {statusData[0].value}% of properties are currently active and occupied.
            </p>
            <p className="text-sm">
              The property maintenance schedule shows that {statusData[2].value}% of properties are currently undergoing routine maintenance, which is within the expected quarterly target of 10-15%.
            </p>
          </div>
          <div>
            <h5 className="text-sm font-medium mb-2">Key Metrics</h5>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Properties:</span>
                <span className="text-sm font-medium">{totalProperties}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm text-muted-foreground">Average Property Age:</span>
                <span className="text-sm font-medium">{avgPropertyAge} years</span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm text-muted-foreground">Occupancy Rate:</span>
                <span className="text-sm font-medium">{occupancyRate}%</span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm text-muted-foreground">Average Annual HOA Fee:</span>
                <span className="text-sm font-medium">${avgAnnualFee.toLocaleString()}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyOverviewReport;
