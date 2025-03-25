
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend
} from 'recharts';

interface ResidentOverviewReportProps {
  timeRange: string;
  association: string;
}

const ResidentOverviewReport = ({ timeRange, association }: ResidentOverviewReportProps) => {
  // Sample resident status data for charts
  const residentStatusData = [
    { name: 'Owner-Occupied', value: 65 },
    { name: 'Tenant-Occupied', value: 25 },
    { name: 'Vacant', value: 10 },
  ];

  // Sample resident communication stats
  const communicationStatsData = [
    { month: 'Feb', emailOpen: 72, emailClick: 45, smsDelivery: 85 },
    { month: 'Mar', emailOpen: 75, emailClick: 48, smsDelivery: 88 },
    { month: 'Apr', emailOpen: 70, emailClick: 40, smsDelivery: 82 },
    { month: 'May', emailOpen: 78, emailClick: 52, smsDelivery: 90 },
    { month: 'Jun', emailOpen: 80, emailClick: 55, smsDelivery: 92 },
    { month: 'Jul', emailOpen: 82, emailClick: 58, smsDelivery: 93 },
  ];

  const COLORS = ['#4ade80', '#f87171', '#facc15', '#60a5fa'];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div>
          <h4 className="text-base font-medium mb-4">Resident Status Distribution</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={residentStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {residentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <h4 className="text-base font-medium mb-4">Communication Effectiveness</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={communicationStatsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Line type="monotone" dataKey="emailOpen" name="Email Open Rate" stroke="#4ade80" strokeWidth={2} />
                <Line type="monotone" dataKey="emailClick" name="Email Click Rate" stroke="#60a5fa" strokeWidth={2} />
                <Line type="monotone" dataKey="smsDelivery" name="SMS Delivery Rate" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium">Total Residents</h4>
            <p className="text-2xl font-bold mt-1">345</p>
            <p className="text-xs text-green-600 mt-1">+15 since last quarter</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium">Owner-Occupied</h4>
            <p className="text-2xl font-bold mt-1">65%</p>
            <p className="text-xs text-muted-foreground mt-1">224 properties</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium">Tenant-Occupied</h4>
            <p className="text-2xl font-bold mt-1">25%</p>
            <p className="text-xs text-muted-foreground mt-1">86 properties</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium">Vacant</h4>
            <p className="text-2xl font-bold mt-1">10%</p>
            <p className="text-xs text-amber-600 mt-1">35 properties</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 p-4 bg-muted/50 rounded-md">
        <h4 className="text-base font-medium mb-2">Resident Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm mb-2">
              The community has maintained a healthy owner-occupancy rate of 65%, which is above the target of 60%. The vacancy rate has decreased by 2% compared to the previous quarter, indicating improved occupancy.
            </p>
            <p className="text-sm">
              Resident engagement with digital communications has shown a positive trend, with email open rates increasing by 5% and SMS delivery rates remaining consistently above 90%.
            </p>
          </div>
          <div>
            <h5 className="text-sm font-medium mb-2">Key Resident Metrics</h5>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-sm text-muted-foreground">Average Residency Duration:</span>
                <span className="text-sm font-medium">4.2 years</span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm text-muted-foreground">New Residents (YTD):</span>
                <span className="text-sm font-medium">28</span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm text-muted-foreground">Resident Turnover Rate:</span>
                <span className="text-sm font-medium">8%</span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm text-muted-foreground">Digital Communication Opt-in:</span>
                <span className="text-sm font-medium">92%</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentOverviewReport;
