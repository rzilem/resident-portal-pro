
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, FileCog, Filter, PieChart as PieChartIcon, BarChart2, Calendar, Building } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { generateReport } from '@/utils/pdfGenerator';

// Mock data types
interface PropertyColumn {
  id: string;
  name: string;
  checked: boolean;
}

// Financial Report Data
const financialData = [
  { month: 'Jan', income: 42500, expenses: 38700, balance: 3800 },
  { month: 'Feb', income: 43200, expenses: 39100, balance: 4100 },
  { month: 'Mar', income: 43800, expenses: 40200, balance: 3600 },
  { month: 'Apr', income: 44100, expenses: 39800, balance: 4300 },
  { month: 'May', income: 42900, expenses: 41100, balance: 1800 },
  { month: 'Jun', income: 43500, expenses: 40500, balance: 3000 },
];

// Property Report Data
const propertyData = [
  { name: 'Oakwood Heights', units: 120, occupancy: 95, violations: 12 },
  { name: 'Willow Creek', units: 85, occupancy: 88, violations: 8 },
  { name: 'Riverfront Towers', units: 210, occupancy: 92, violations: 23 },
  { name: 'Pine Valley', units: 65, occupancy: 100, violations: 5 },
  { name: 'Meadow Vista', units: 95, occupancy: 91, violations: 10 },
];

// Resident Report Data
const residentData = [
  { month: 'Jan', moveIns: 12, moveOuts: 8 },
  { month: 'Feb', moveIns: 9, moveOuts: 7 },
  { month: 'Mar', moveIns: 15, moveOuts: 10 },
  { month: 'Apr', moveIns: 10, moveOuts: 9 },
  { month: 'May', moveIns: 8, moveOuts: 12 },
  { month: 'Jun', moveIns: 14, moveOuts: 6 },
];

// Expense breakdown data
const expenseData = [
  { name: 'Maintenance', value: 35 },
  { name: 'Utilities', value: 25 },
  { name: 'Admin', value: 15 },
  { name: 'Landscaping', value: 10 },
  { name: 'Insurance', value: 10 },
  { name: 'Other', value: 5 },
];

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('financial');
  const [timeRange, setTimeRange] = useState('month');
  const [property, setProperty] = useState('all');
  
  const handleExportFinancialData = (format: string) => {
    toast.success(`Exporting financial report as ${format.toUpperCase()}`);
    
    if (format === 'pdf') {
      const doc = generateReport({
        title: 'Financial Report',
        subtitle: 'Income vs Expenses',
        date: new Date().toLocaleDateString(),
        columns: ['Month', 'Income', 'Expenses', 'Balance'],
        data: financialData.map(d => [
          d.month,
          `$${d.income.toLocaleString()}`,
          `$${d.expenses.toLocaleString()}`,
          `$${d.balance.toLocaleString()}`
        ]),
        summary: {
          'Total Income': `$${financialData.reduce((sum, d) => sum + d.income, 0).toLocaleString()}`,
          'Total Expenses': `$${financialData.reduce((sum, d) => sum + d.expenses, 0).toLocaleString()}`,
          'Net Balance': `$${financialData.reduce((sum, d) => sum + d.balance, 0).toLocaleString()}`
        }
      });
      
      doc.save('financial-report.pdf');
    }
  };
  
  const handleExportPropertyData = (format: string) => {
    toast.success(`Exporting property report as ${format.toUpperCase()}`);
    
    if (format === 'pdf') {
      const doc = generateReport({
        title: 'Property Report',
        subtitle: 'Property Overview',
        date: new Date().toLocaleDateString(),
        columns: ['Property', 'Units', 'Occupancy Rate', 'Violations'],
        data: propertyData.map(d => [
          d.name,
          d.units.toString(),
          `${d.occupancy}%`,
          d.violations.toString()
        ]),
        summary: {
          'Total Properties': propertyData.length.toString(),
          'Total Units': propertyData.reduce((sum, d) => sum + d.units, 0).toString(),
          'Average Occupancy': `${(propertyData.reduce((sum, d) => sum + d.occupancy, 0) / propertyData.length).toFixed(1)}%`
        }
      });
      
      doc.save('property-report.pdf');
    }
  };
  
  const handleExportResidentData = (format: string) => {
    toast.success(`Exporting resident report as ${format.toUpperCase()}`);
    
    if (format === 'pdf') {
      const doc = generateReport({
        title: 'Resident Report',
        subtitle: 'Move-Ins and Move-Outs',
        date: new Date().toLocaleDateString(),
        columns: ['Month', 'Move-Ins', 'Move-Outs', 'Net Change'],
        data: residentData.map(d => [
          d.month,
          d.moveIns.toString(),
          d.moveOuts.toString(),
          (d.moveIns - d.moveOuts).toString()
        ]),
        summary: {
          'Total Move-Ins': residentData.reduce((sum, d) => sum + d.moveIns, 0).toString(),
          'Total Move-Outs': residentData.reduce((sum, d) => sum + d.moveOuts, 0).toString(),
          'Net Change': residentData.reduce((sum, d) => sum + (d.moveIns - d.moveOuts), 0).toString()
        }
      });
      
      doc.save('resident-report.pdf');
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileCog className="h-5 w-5 text-blue-600" />
            Reports
          </h2>
          <p className="text-muted-foreground">
            Generate and view reports for your properties
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue={property} onValueChange={setProperty}>
            <SelectTrigger className="w-[180px]">
              <Building className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select Property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="oakwood">Oakwood Heights</SelectItem>
              <SelectItem value="willow">Willow Creek</SelectItem>
              <SelectItem value="riverfront">Riverfront Towers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="financial" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="property">Property</TabsTrigger>
          <TabsTrigger value="resident">Resident</TabsTrigger>
        </TabsList>
        
        {/* Financial Reports */}
        {activeTab === 'financial' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Income vs Expenses</CardTitle>
                  <CardDescription>Financial overview by month</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleExportFinancialData('pdf')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={financialData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, undefined]} />
                      <Area type="monotone" dataKey="income" stackId="1" stroke="#8884d8" fill="#8884d8" name="Income" />
                      <Area type="monotone" dataKey="expenses" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Expenses" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Expense Breakdown</CardTitle>
                  <CardDescription>Expenses by category</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, undefined]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Monthly Net Balance</CardTitle>
                  <CardDescription>Income minus expenses</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={financialData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, undefined]} />
                      <Bar dataKey="balance" fill="#8884d8" name="Net Balance" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Property Reports */}
        {activeTab === 'property' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Property Overview</CardTitle>
                  <CardDescription>Units and occupancy by property</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleExportPropertyData('pdf')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={propertyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="units" fill="#8884d8" name="Units" />
                      <Bar yAxisId="right" dataKey="occupancy" fill="#82ca9d" name="Occupancy %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Violations by Property</CardTitle>
                  <CardDescription>Number of violations reported</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={propertyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="violations" fill="#ff7300" name="Violations" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Occupancy Rates</CardTitle>
                  <CardDescription>Percentage of occupied units</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={propertyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Occupancy']} />
                      <Line type="monotone" dataKey="occupancy" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Resident Reports */}
        {activeTab === 'resident' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Resident Movement</CardTitle>
                  <CardDescription>Move-ins and move-outs by month</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleExportResidentData('pdf')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={residentData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="moveIns" fill="#8884d8" name="Move-Ins" />
                      <Bar dataKey="moveOuts" fill="#82ca9d" name="Move-Outs" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Net Resident Change</CardTitle>
                  <CardDescription>Monthly resident net change</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={residentData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        data={residentData.map(d => ({
                          month: d.month,
                          netChange: d.moveIns - d.moveOuts
                        }))}
                        dataKey="netChange" 
                        stroke="#8884d8" 
                        name="Net Change"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Cumulative Change</CardTitle>
                  <CardDescription>Running total of resident changes</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={residentData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        data={residentData.reduce((acc, curr) => {
                          const netChange = curr.moveIns - curr.moveOuts;
                          const lastValue = acc.length > 0 ? acc[acc.length - 1].cumulative : 0;
                          acc.push({
                            month: curr.month,
                            cumulative: lastValue + netChange
                          });
                          return acc;
                        }, [] as Array<{month: string, cumulative: number}>)}
                        dataKey="cumulative" 
                        stroke="#8884d8" 
                        fill="#8884d8"
                        name="Cumulative Change"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </Tabs>
    </div>
  );
};

export default Reports;
