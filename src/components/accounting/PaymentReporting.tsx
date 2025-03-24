
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileDown, Filter, Calendar, DollarSign, Wallet, PieChart as PieChartIcon, BarChart as BarChartIcon, TrendingUp, Building } from "lucide-react";
import { toast } from "sonner";

// Sample data for charts
const monthlyData = [
  { name: 'Jan', amount: 25000 },
  { name: 'Feb', amount: 28500 },
  { name: 'Mar', amount: 27300 },
  { name: 'Apr', amount: 29800 },
  { name: 'May', amount: 31200 },
  { name: 'Jun', amount: 30400 },
  { name: 'Jul', amount: 33500 },
  { name: 'Aug', amount: 32700 },
  { name: 'Sep', amount: 34200 },
  { name: 'Oct', amount: 35800 },
  { name: 'Nov', amount: 37500 },
  { name: 'Dec', amount: 39000 },
];

const methodData = [
  { name: 'Credit Card', value: 45 },
  { name: 'ACH Transfer', value: 30 },
  { name: 'Check', value: 20 },
  { name: 'Cash', value: 5 },
];

const statusData = [
  { name: 'On Time', value: 65 },
  { name: 'Late < 30 Days', value: 25 },
  { name: 'Late > 30 Days', value: 7 },
  { name: 'Unpaid', value: 3 },
];

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const PaymentReporting = () => {
  const [timeRange, setTimeRange] = useState('year');
  const [association, setAssociation] = useState('all');
  
  // Simulate exporting a report
  const exportReport = () => {
    toast.success("Report exported as PDF");
  };
  
  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <CardTitle>Payment Analytics</CardTitle>
            <CardDescription>
              Analyze payment trends and performance metrics
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={association} onValueChange={setAssociation}>
              <SelectTrigger className="w-[180px]">
                <Building className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Associations</SelectItem>
                <SelectItem value="sunset">Sunset Heights HOA</SelectItem>
                <SelectItem value="ocean">Ocean View Condos</SelectItem>
                <SelectItem value="mountain">Mountain Valley Association</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="gap-2" onClick={exportReport}>
              <FileDown className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="trends">
            <TabsList className="w-full grid grid-cols-1 md:grid-cols-3 mb-6">
              <TabsTrigger value="trends" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Payment Trends
              </TabsTrigger>
              <TabsTrigger value="methods" className="gap-2">
                <Wallet className="h-4 w-4" />
                Payment Methods
              </TabsTrigger>
              <TabsTrigger value="status" className="gap-2">
                <PieChartIcon className="h-4 w-4" />
                Payment Status
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="trends" className="p-1">
              <div className="bg-card rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">Monthly Payment Trends</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Total payments collected each month for {timeRange === 'all' ? 'all associations' : 'selected association'}
                </p>
                
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Bar dataKey="amount" name="Total Payments" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <Card>
                    <CardContent className="p-4 flex flex-col gap-1">
                      <p className="text-sm text-muted-foreground">Total Collected</p>
                      <p className="text-2xl font-bold">$384,900</p>
                      <p className="text-xs text-green-600">
                        +12.3% vs last year
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 flex flex-col gap-1">
                      <p className="text-sm text-muted-foreground">Average Monthly</p>
                      <p className="text-2xl font-bold">$32,075</p>
                      <p className="text-xs text-green-600">
                        +5.8% vs last year
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 flex flex-col gap-1">
                      <p className="text-sm text-muted-foreground">Highest Month</p>
                      <p className="text-2xl font-bold">$39,000</p>
                      <p className="text-xs text-muted-foreground">
                        December
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 flex flex-col gap-1">
                      <p className="text-sm text-muted-foreground">Collection Rate</p>
                      <p className="text-2xl font-bold">97.3%</p>
                      <p className="text-xs text-green-600">
                        +2.1% vs last year
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="methods" className="p-1">
              <div className="bg-card rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">Payment Methods Distribution</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Breakdown of payment methods used by residents
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="h-[300px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={methodData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {methodData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-6">
                    <h4 className="text-base font-medium">Key Insights</h4>
                    
                    <div className="space-y-4">
                      {methodData.map((method, index) => (
                        <div key={method.name} className="flex items-center">
                          <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span>{method.name}</span>
                              <span className="font-medium">{method.value}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                              <div className="h-1.5 rounded-full" 
                                style={{ 
                                  width: `${method.value}%`,
                                  backgroundColor: COLORS[index % COLORS.length]
                                }} 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-md text-sm">
                      <p className="font-medium mb-2">Recommendations</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Encourage more online payments to reduce manual processing.</li>
                        <li>Consider reducing the ACH fee to increase adoption.</li>
                        <li>Provide educational materials about digital payment options.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="status" className="p-1">
              <div className="bg-card rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">Payment Status Analysis</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Overview of current payment statuses across all units
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="h-[300px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
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
                  
                  <div className="space-y-6">
                    <h4 className="text-base font-medium">Payment Timing Analysis</h4>
                    
                    <div className="space-y-4">
                      {statusData.map((status, index) => (
                        <div key={status.name} className="flex items-center">
                          <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span>{status.name}</span>
                              <span className="font-medium">{status.value}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                              <div className="h-1.5 rounded-full" 
                                style={{ 
                                  width: `${status.value}%`,
                                  backgroundColor: COLORS[index % COLORS.length]
                                }} 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-md text-sm">
                      <p className="font-medium mb-2">Actions to Improve Collection Rate</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Send automated payment reminders 5 days before due date.</li>
                        <li>Implement a one-click payment option for residents.</li>
                        <li>Follow up with late payers via multiple channels.</li>
                        <li>Consider early payment discounts to increase on-time payments.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentReporting;
