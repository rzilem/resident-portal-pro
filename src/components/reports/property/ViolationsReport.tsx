
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Download, Filter, HelpCircle, Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
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

interface ViolationsReportProps {
  timeRange: string;
  association: string;
  onExport: (columns: PropertyColumn[]) => void;
}

const ViolationsReport = ({ timeRange, association, onExport }: ViolationsReportProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [violationType, setViolationType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample violation data
  const violations = [
    { id: 'V-001', property: 'Oakwood Heights, Unit 102', type: 'Landscaping', status: 'Open', date: '2023-06-15', resident: 'Robert Smith', severity: 'Minor' },
    { id: 'V-002', property: 'Riverfront Towers, Unit 304', type: 'Exterior Modification', status: 'Resolved', date: '2023-05-28', resident: 'Emily Davis', severity: 'Major' },
    { id: 'V-003', property: 'Willow Creek Estates, Unit 205', type: 'Noise', status: 'In Progress', date: '2023-06-10', resident: 'Alice Johnson', severity: 'Moderate' },
    { id: 'V-004', property: 'Pinewood Commons, Unit 408', type: 'Parking', status: 'Open', date: '2023-06-18', resident: 'Michael Wilson', severity: 'Minor' },
    { id: 'V-005', property: 'Sunset Gardens, Unit 112', type: 'Pet', status: 'Resolved', date: '2023-05-20', resident: 'Jennifer Taylor', severity: 'Moderate' },
    { id: 'V-006', property: 'Lakeside Villas, Unit 506', type: 'Landscaping', status: 'Open', date: '2023-06-05', resident: 'David Brown', severity: 'Major' },
    { id: 'V-007', property: 'Oakwood Heights, Unit 210', type: 'Trash', status: 'In Progress', date: '2023-06-12', resident: 'Susan Miller', severity: 'Minor' },
    { id: 'V-008', property: 'Riverfront Towers, Unit 115', type: 'Exterior Modification', status: 'Open', date: '2023-06-20', resident: 'James Wilson', severity: 'Major' },
  ];

  // Filter violations based on search query, violation type, and status
  const filteredViolations = violations.filter(violation => {
    const matchesSearch = 
      violation.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      violation.resident.toLowerCase().includes(searchQuery.toLowerCase()) ||
      violation.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = violationType === 'all' || violation.type === violationType;
    const matchesStatus = statusFilter === 'all' || violation.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Get violation counts by type for chart
  const violationsByType = [
    { name: 'Landscaping', count: violations.filter(v => v.type === 'Landscaping').length },
    { name: 'Exterior Modification', count: violations.filter(v => v.type === 'Exterior Modification').length },
    { name: 'Noise', count: violations.filter(v => v.type === 'Noise').length },
    { name: 'Parking', count: violations.filter(v => v.type === 'Parking').length },
    { name: 'Pet', count: violations.filter(v => v.type === 'Pet').length },
    { name: 'Trash', count: violations.filter(v => v.type === 'Trash').length },
  ];

  // Get violation counts by status for pie chart
  const violationsByStatus = [
    { name: 'Open', value: violations.filter(v => v.status === 'Open').length, color: '#f87171' },
    { name: 'In Progress', value: violations.filter(v => v.status === 'In Progress').length, color: '#facc15' },
    { name: 'Resolved', value: violations.filter(v => v.status === 'Resolved').length, color: '#4ade80' },
  ];

  // Default columns for exporting
  const defaultColumns: PropertyColumn[] = [
    { id: 'id', label: 'Violation ID', checked: true },
    { id: 'property', label: 'Property', checked: true },
    { id: 'type', label: 'Violation Type', checked: true },
    { id: 'status', label: 'Status', checked: true },
    { id: 'date', label: 'Date', checked: true },
    { id: 'resident', label: 'Resident', checked: true },
    { id: 'severity', label: 'Severity', checked: true },
  ];

  // Function to format date
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

      {/* Violation statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium">Total Violations</h4>
            <p className="text-2xl font-bold mt-1">{violations.length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {timeRange === 'month' ? 'This Month' : 
               timeRange === 'quarter' ? 'This Quarter' : 
               timeRange === 'year' ? 'This Year' : 'Selected Period'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium">Open Violations</h4>
            <p className="text-2xl font-bold mt-1">{violations.filter(v => v.status === 'Open').length}</p>
            <p className="text-xs text-red-600 mt-1">
              {violations.filter(v => v.status === 'Open').length > 3 ? 
                '+2 from last month' : 
                '-1 from last month'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium">Resolution Rate</h4>
            <p className="text-2xl font-bold mt-1">
              {Math.round((violations.filter(v => v.status === 'Resolved').length / violations.length) * 100)}%
            </p>
            <p className="text-xs text-green-600 mt-1">+5% from last period</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        {/* Violations by Type */}
        <div>
          <h4 className="text-base font-medium mb-4">Violations by Type</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={violationsByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Number of Violations" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Violations by Status */}
        <div>
          <h4 className="text-base font-medium mb-4">Violations by Status</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={violationsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {violationsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} violations`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search violations..." 
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={violationType} onValueChange={setViolationType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Violation Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Landscaping">Landscaping</SelectItem>
            <SelectItem value="Exterior Modification">Exterior Modification</SelectItem>
            <SelectItem value="Noise">Noise</SelectItem>
            <SelectItem value="Parking">Parking</SelectItem>
            <SelectItem value="Pet">Pet</SelectItem>
            <SelectItem value="Trash">Trash</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Violations Table */}
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Violation ID</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Resident</TableHead>
              <TableHead>Violation Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredViolations.length > 0 ? (
              filteredViolations.map((violation) => (
                <TableRow key={violation.id}>
                  <TableCell className="font-medium">{violation.id}</TableCell>
                  <TableCell>{violation.property}</TableCell>
                  <TableCell>{violation.resident}</TableCell>
                  <TableCell>{violation.type}</TableCell>
                  <TableCell>{formatDate(violation.date)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      violation.severity === 'Minor' ? 'bg-blue-100 text-blue-800' : 
                      violation.severity === 'Moderate' ? 'bg-amber-100 text-amber-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {violation.severity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      violation.status === 'Open' ? 'bg-red-100 text-red-800' : 
                      violation.status === 'In Progress' ? 'bg-amber-100 text-amber-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {violation.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-lg font-medium">No violations found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Report Insights */}
      <div className="mt-6 p-4 bg-muted/50 rounded-md">
        <h4 className="text-base font-medium mb-2">Violation Report Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm mb-2">
              This report shows a total of {violations.length} violations across all properties, with {violations.filter(v => v.status === 'Open').length} currently open. 
              The most common violation type is {violationsByType.sort((a, b) => b.count - a.count)[0].name} with {violationsByType.sort((a, b) => b.count - a.count)[0].count} occurrences.
            </p>
            <p className="text-sm">
              The current resolution rate is {Math.round((violations.filter(v => v.status === 'Resolved').length / violations.length) * 100)}%, which is a 5% improvement from the previous period.
            </p>
          </div>
          <div>
            <h5 className="text-sm font-medium mb-2">Recommendations</h5>
            <ul className="space-y-1 text-sm">
              <li>• Focus on addressing open landscaping violations, which have increased by 2 since last month</li>
              <li>• Review the notification process for exterior modifications to improve compliance</li>
              <li>• Consider revising the parking policy to address recurring violations</li>
              <li>• Schedule community education session on most common violation types</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViolationsReport;
