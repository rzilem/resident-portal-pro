
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, HelpCircle } from 'lucide-react';
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
  Cell,
  LineChart,
  Line
} from 'recharts';
import { PropertyColumn } from '@/components/properties/PropertyColumnsSelector';
import { Card, CardContent } from '@/components/ui/card';

interface PropertyReportsProps {
  properties: Property[];
  timeRange: string;
  association: string;
  onExport: (columns: PropertyColumn[]) => void;
  onTemplateDownload: () => void;
  selectedReport: string;
}

const PropertyReports = ({ 
  properties, 
  timeRange, 
  association,
  onExport,
  onTemplateDownload,
  selectedReport
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

  // Sample ARC request data
  const arcRequestData = [
    { id: 'ARC-001', property: 'Oakwood Residence', type: 'Exterior Paint', status: 'Approved', submitDate: '2023-05-10', decisionDate: '2023-05-20' },
    { id: 'ARC-002', property: 'Willow Heights', type: 'Fence Installation', status: 'Pending', submitDate: '2023-06-05', decisionDate: null },
    { id: 'ARC-003', property: 'Cedar Point', type: 'Roof Replacement', status: 'Approved', submitDate: '2023-06-12', decisionDate: '2023-06-25' },
    { id: 'ARC-004', property: 'Maple Grove', type: 'Landscaping', status: 'Denied', submitDate: '2023-06-18', decisionDate: '2023-06-28' },
    { id: 'ARC-005', property: 'Birchwood Court', type: 'Solar Panels', status: 'Approved', submitDate: '2023-07-01', decisionDate: '2023-07-15' },
    { id: 'ARC-006', property: 'Pine Valley', type: 'Driveway Extension', status: 'Pending', submitDate: '2023-07-10', decisionDate: null },
  ];

  // Violation data
  const violationData = [
    { id: 'V-2301', property: 'Oakwood Residence', type: 'Lawn Maintenance', status: 'Open', reportDate: '2023-06-10', dueDate: '2023-06-25' },
    { id: 'V-2302', property: 'Willow Heights', type: 'Unauthorized Structure', status: 'Closed', reportDate: '2023-05-15', dueDate: '2023-05-30' },
    { id: 'V-2303', property: 'Cedar Point', type: 'Parking Violation', status: 'Open', reportDate: '2023-07-02', dueDate: '2023-07-17' },
    { id: 'V-2304', property: 'Maple Grove', type: 'Exterior Maintenance', status: 'In Progress', reportDate: '2023-06-20', dueDate: '2023-07-05' },
    { id: 'V-2305', property: 'Birchwood Court', type: 'Noise Complaint', status: 'Closed', reportDate: '2023-06-25', dueDate: '2023-07-10' },
    { id: 'V-2306', property: 'Pine Valley', type: 'Pet Violation', status: 'Open', reportDate: '2023-07-05', dueDate: '2023-07-20' },
  ];

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
    { id: 'units', label: 'Units', checked: true },
    { id: 'status', label: 'Status', checked: true },
    { id: 'foundedDate', label: 'Founded Date', checked: true },
  ];

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Render different property reports based on the selected report
  const renderReportContent = () => {
    switch (selectedReport) {
      case 'overview':
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
      
      case 'arc-report':
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                Architectural Review Committee (ARC) Report
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
                  <TableHead>Request ID</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Request Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submit Date</TableHead>
                  <TableHead>Decision Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {arcRequestData.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>{request.property}</TableCell>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        request.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                        request.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(request.submitDate)}</TableCell>
                    <TableCell>{formatDate(request.decisionDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium">Total Requests</h4>
                  <p className="text-2xl font-bold mt-1">6</p>
                  <p className="text-xs text-muted-foreground mt-1">Last 90 days</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium">Approval Rate</h4>
                  <p className="text-2xl font-bold mt-1">75%</p>
                  <p className="text-xs text-green-600 mt-1">+5% from last quarter</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium">Avg. Turnaround</h4>
                  <p className="text-2xl font-bold mt-1">12 days</p>
                  <p className="text-xs text-green-600 mt-1">-2 days from last quarter</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6 p-4 bg-muted/50 rounded-md">
              <h4 className="text-base font-medium mb-2">ARC Request Insights</h4>
              <p className="text-sm">
                Exterior modifications continue to be the most common request type this quarter. The ARC committee has improved its average response time by 2 days compared to the previous quarter, with most requests now receiving decisions within 12 days of submission.
              </p>
            </div>
          </div>
        );
        
      case 'violations':
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
                        {statusData.map((entry, index) => (
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
        
      case 'work-order':
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
        
      default:
        return (
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
        );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
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
      
      {renderReportContent()}
    </div>
  );
};

export default PropertyReports;
