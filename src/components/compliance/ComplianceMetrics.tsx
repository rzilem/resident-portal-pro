
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, BarChart, Bar } from 'recharts';

// Mock data for charts
const monthlyData = [
  { name: 'Jan', total: 42, resolved: 35, rate: 83 },
  { name: 'Feb', total: 38, resolved: 30, rate: 79 },
  { name: 'Mar', total: 45, resolved: 40, rate: 89 },
  { name: 'Apr', total: 50, resolved: 38, rate: 76 },
  { name: 'May', total: 55, resolved: 48, rate: 87 },
  { name: 'Jun', total: 48, resolved: 40, rate: 83 },
  { name: 'Jul', total: 52, resolved: 45, rate: 87 },
  { name: 'Aug', total: 47, resolved: 42, rate: 89 },
  { name: 'Sep', total: 53, resolved: 44, rate: 83 },
  { name: 'Oct', total: 57, resolved: 51, rate: 89 },
  { name: 'Nov', total: 62, resolved: 50, rate: 81 },
  { name: 'Dec', total: 45, resolved: 42, rate: 93 }
];

const violationTypeData = [
  { name: 'Landscaping', value: 35 },
  { name: 'Exterior Maintenance', value: 28 },
  { name: 'Parking', value: 18 },
  { name: 'Noise', value: 12 },
  { name: 'Pet Control', value: 9 },
  { name: 'Trash Disposal', value: 8 },
  { name: 'Unauthorized Modifications', value: 7 }
];

const timeToResolveData = [
  { name: '< 7 days', value: 45 },
  { name: '7-14 days', value: 30 },
  { name: '15-30 days', value: 15 },
  { name: '30-60 days', value: 7 },
  { name: '> 60 days', value: 3 }
];

const ComplianceMetrics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('year');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle>Compliance Performance</CardTitle>
            <CardDescription>
              Track violations and resolution trends over time
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="halfyear">Last 6 Months</SelectItem>
              <SelectItem value="year">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="total" name="Total Violations" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="resolved" name="Resolved" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resolution Rate</CardTitle>
            <CardDescription>
              Percentage of violations resolved over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="rate" name="Resolution Rate (%)" stroke="#ff7300" yAxisId={0} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Violations by Type</CardTitle>
            <CardDescription>
              Distribution of violation categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={violationTypeData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 70,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Number of Violations" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Time to Resolution</CardTitle>
            <CardDescription>
              Average time to resolve violations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={timeToResolveData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Number of Violations" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComplianceMetrics;
