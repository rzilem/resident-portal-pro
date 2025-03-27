
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Download, Filter, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip 
} from 'recharts';
import { Badge } from '@/components/ui/badge';

const Compliance = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Sample violation data
  const violations = [
    { id: 1, property: '123 Main St', unit: 'A', category: 'Landscaping', description: 'Overgrown grass', reportedDate: '2023-10-05', status: 'Open', severity: 'Medium' },
    { id: 2, property: '456 Oak Ave', unit: 'B', category: 'Architectural', description: 'Unauthorized exterior modification', reportedDate: '2023-10-02', status: 'In Progress', severity: 'High' },
    { id: 3, property: '789 Pine Ln', unit: 'C', category: 'Noise', description: 'Excessive noise complaints', reportedDate: '2023-09-28', status: 'Resolved', severity: 'Medium' },
    { id: 4, property: '234 Elm St', unit: 'D', category: 'Parking', description: 'Vehicle parked in no-parking zone', reportedDate: '2023-09-25', status: 'Open', severity: 'Low' },
    { id: 5, property: '567 Cedar Rd', unit: 'E', category: 'Trash', description: 'Improper trash disposal', reportedDate: '2023-09-20', status: 'Warning Sent', severity: 'Medium' },
    { id: 6, property: '890 Maple Dr', unit: 'F', category: 'Pets', description: 'Unleashed pet in common area', reportedDate: '2023-09-15', status: 'Resolved', severity: 'Low' },
  ];

  // Filter violations based on selected status
  const filteredViolations = selectedStatus === 'all' 
    ? violations 
    : violations.filter(v => v.status.toLowerCase() === selectedStatus.toLowerCase());

  // Chart data for violation summary
  const statusData = [
    { name: 'Open', value: violations.filter(v => v.status === 'Open').length },
    { name: 'Warning Sent', value: violations.filter(v => v.status === 'Warning Sent').length },
    { name: 'In Progress', value: violations.filter(v => v.status === 'In Progress').length },
    { name: 'Resolved', value: violations.filter(v => v.status === 'Resolved').length },
  ];

  const categoryData = [
    { name: 'Landscaping', value: violations.filter(v => v.category === 'Landscaping').length },
    { name: 'Architectural', value: violations.filter(v => v.category === 'Architectural').length },
    { name: 'Noise', value: violations.filter(v => v.category === 'Noise').length },
    { name: 'Parking', value: violations.filter(v => v.category === 'Parking').length },
    { name: 'Trash', value: violations.filter(v => v.category === 'Trash').length },
    { name: 'Pets', value: violations.filter(v => v.category === 'Pets').length },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-red-100 text-red-700 dark:bg-red-800/20 dark:text-red-400';
      case 'Warning Sent':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-800/20 dark:text-amber-400';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-800/20 dark:text-blue-400';
      case 'Resolved':
        return 'bg-green-100 text-green-700 dark:bg-green-800/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800/20 dark:text-gray-400';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High':
        return 'bg-red-100 text-red-700 dark:bg-red-800/20 dark:text-red-400';
      case 'Medium':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-800/20 dark:text-amber-400';
      case 'Low':
        return 'bg-green-100 text-green-700 dark:bg-green-800/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800/20 dark:text-gray-400';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compliance Management</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage rule violations and compliance issues
          </p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Report Violation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Violation Status
            </CardTitle>
            <CardDescription>
              Overview of current violation statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Violation Categories
            </CardTitle>
            <CardDescription>
              Breakdown of violations by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-bold">Violation Records</h2>
        <div className="flex w-full md:w-auto gap-2 items-center">
          <Select 
            defaultValue="all" 
            onValueChange={setSelectedStatus}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="warning sent">Warning Sent</SelectItem>
              <SelectItem value="in progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search violations..." 
              className="pl-8"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Reported</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredViolations.map((violation) => (
                <TableRow key={violation.id}>
                  <TableCell>{violation.property}</TableCell>
                  <TableCell>{violation.unit}</TableCell>
                  <TableCell>{violation.category}</TableCell>
                  <TableCell>{violation.description}</TableCell>
                  <TableCell>{violation.reportedDate}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`${getSeverityColor(violation.severity)}`}
                    >
                      {violation.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(violation.status)}`}
                    >
                      {violation.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Compliance;
