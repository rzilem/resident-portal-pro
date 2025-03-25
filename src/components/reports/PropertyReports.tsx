
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Property } from '@/components/properties/PropertyHelpers';
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
import { PropertyColumn } from '@/components/properties/PropertyColumnsSelector';

interface PropertyReportsProps {
  properties: Property[];
  timeRange: string;
  association: string;
  onExport: (columns: PropertyColumn[]) => void;
  onTemplateDownload: () => void;
}

const PropertyReports = ({ 
  properties, 
  timeRange, 
  association,
  onExport,
  onTemplateDownload
}: PropertyReportsProps) => {
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

  // Default columns for exporting
  const defaultColumns: PropertyColumn[] = [
    { id: 'name', label: 'Property Name', checked: true },
    { id: 'location', label: 'Location', checked: true },
    { id: 'units', label: 'Units', checked: true },
    { id: 'status', label: 'Status', checked: true },
    { id: 'foundedDate', label: 'Founded Date', checked: true },
  ];

  return (
    <Tabs defaultValue="overview">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Property List</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={() => onExport(defaultColumns)}
          >
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={onTemplateDownload}
          >
            <FileText className="h-4 w-4" />
            Get Template
          </Button>
        </div>
      </div>
      
      <TabsContent value="overview" className="pt-4">
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
      </TabsContent>
      
      <TabsContent value="properties" className="pt-4">
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Founded Date</TableHead>
                <TableHead>Annual Fees</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.length > 0 ? (
                properties.map((property, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{property.name}</TableCell>
                    <TableCell>{property.location}</TableCell>
                    <TableCell>{property.units}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        property.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {property.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(property.foundedDate).toLocaleDateString()}</TableCell>
                    <TableCell>${property.annualFees}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">No properties data available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
      
      <TabsContent value="statistics" className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Average Property Age', value: '14.5 years', change: '+1.2 years', trend: 'up' },
            { title: 'Average Property Value', value: '$425,000', change: '+8.3%', trend: 'up' },
            { title: 'Maintenance Cost per Unit', value: '$1,850/year', change: '-3.5%', trend: 'down' },
            { title: 'Average Unit Size', value: '1,750 sq ft', change: '+0%', trend: 'neutral' },
            { title: 'Property Tax Rate', value: '1.25%', change: '+0.05%', trend: 'up' },
            { title: 'Insurance Cost', value: '$2,100/year', change: '+2.8%', trend: 'up' },
          ].map((stat, index) => (
            <div key={index} className="bg-card border rounded-lg p-4">
              <h5 className="text-sm text-muted-foreground">{stat.title}</h5>
              <p className="text-xl font-bold mt-1">{stat.value}</p>
              <p className={`text-xs mt-1 ${
                stat.trend === 'up' ? 'text-green-600' : 
                stat.trend === 'down' ? 'text-red-600' : 
                'text-gray-600'
              }`}>
                {stat.change} vs last year
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <h4 className="text-base font-medium mb-4">Year-over-Year Property Metrics</h4>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={[
                  { year: '2020', value: 385000, maintenance: 1950, occupancy: 89 },
                  { year: '2021', value: 395000, maintenance: 1920, occupancy: 90 },
                  { year: '2022', value: 405000, maintenance: 1880, occupancy: 91 },
                  { year: '2023', value: 425000, maintenance: 1850, occupancy: 92 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="value" name="Avg. Property Value ($)" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="maintenance" name="Maintenance Cost ($)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default PropertyReports;
