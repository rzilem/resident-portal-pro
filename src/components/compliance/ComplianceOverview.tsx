
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChevronUp, Info, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

// Sample data for the charts
const violationsByType = [
  { name: 'Exterior Maintenance', value: 42 },
  { name: 'Landscaping', value: 28 },
  { name: 'Parking', value: 18 },
  { name: 'Noise', value: 12 },
  { name: 'Other', value: 8 }
];

const monthlyComplianceData = [
  { name: 'Jan', violations: 24, resolutions: 18 },
  { name: 'Feb', violations: 18, resolutions: 15 },
  { name: 'Mar', violations: 32, resolutions: 28 },
  { name: 'Apr', violations: 26, resolutions: 20 },
  { name: 'May', violations: 22, resolutions: 19 },
  { name: 'Jun', violations: 28, resolutions: 22 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ComplianceOverview: React.FC = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Compliance Overview</CardTitle>
            <CardDescription>Overview of association compliance status</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-center gap-4">
              <div className="rounded-full p-2 bg-red-100">
                <ShieldAlert className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Violations</p>
                <h3 className="text-2xl font-bold">108</h3>
                <p className="text-xs text-red-600 flex items-center">
                  <ChevronUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-full p-2 bg-amber-100">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Resolution</p>
                <h3 className="text-2xl font-bold">34</h3>
                <p className="text-xs text-green-600 flex items-center">
                  <ChevronUp className="h-3 w-3 mr-1" />
                  -8% from last month
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-full p-2 bg-green-100">
                <ShieldCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved This Month</p>
                <h3 className="text-2xl font-bold">22</h3>
                <p className="text-xs text-green-600 flex items-center">
                  <ChevronUp className="h-3 w-3 mr-1" />
                  +5% from last month
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Violations by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={violationsByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {violationsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Violations & Resolutions Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyComplianceData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="violations" fill="#FF8042" name="Violations" />
                <Bar dataKey="resolutions" fill="#00C49F" name="Resolutions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceOverview;
