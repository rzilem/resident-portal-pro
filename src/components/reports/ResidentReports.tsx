
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Card, CardContent } from '@/components/ui/card';

interface ResidentReportsProps {
  timeRange: string;
  association: string;
}

const ResidentReports = ({ timeRange, association }: ResidentReportsProps) => {
  // Resident status data
  const statusData = [
    { name: 'Homeowners', value: 65 },
    { name: 'Renters', value: 35 },
  ];

  // Resident tenure data
  const tenureData = [
    { name: '< 1 year', count: 42 },
    { name: '1-3 years', count: 85 },
    { name: '3-5 years', count: 68 },
    { name: '5-10 years', count: 120 },
    { name: '10+ years', count: 103 },
  ];

  // Monthly move-in/out trends
  const movementData = [
    { month: 'Jan', moveIns: 8, moveOuts: 5 },
    { month: 'Feb', moveIns: 6, moveOuts: 4 },
    { month: 'Mar', moveIns: 10, moveOuts: 7 },
    { month: 'Apr', moveIns: 12, moveOuts: 6 },
    { month: 'May', moveIns: 15, moveOuts: 8 },
    { month: 'Jun', moveIns: 18, moveOuts: 10 },
    { month: 'Jul', moveIns: 14, moveOuts: 12 },
    { month: 'Aug', moveIns: 11, moveOuts: 9 },
    { month: 'Sep', moveIns: 9, moveOuts: 7 },
    { month: 'Oct', moveIns: 7, moveOuts: 5 },
    { month: 'Nov', moveIns: 6, moveOuts: 4 },
    { month: 'Dec', moveIns: 8, moveOuts: 6 },
  ];

  const COLORS = ['#4ade80', '#f87171', '#facc15', '#60a5fa', '#a78bfa'];

  return (
    <Tabs defaultValue="overview">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Resident Overview</TabsTrigger>
        <TabsTrigger value="demographics">Demographics</TabsTrigger>
        <TabsTrigger value="movement">Resident Movement</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Total Residents</p>
              <p className="text-2xl font-bold">418</p>
              <p className="text-xs text-green-600">
                +5.2% vs last year
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Average Household Size</p>
              <p className="text-2xl font-bold">2.4</p>
              <p className="text-xs text-gray-600">
                No change vs last year
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Resident Turnover Rate</p>
              <p className="text-2xl font-bold">8.6%</p>
              <p className="text-xs text-green-600">
                -1.2% vs last year
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-base font-medium mb-4">Resident Status</h4>
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
          
          <div>
            <h4 className="text-base font-medium mb-4">Resident Tenure</h4>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tenureData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Number of Residents" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-md">
          <h4 className="text-base font-medium mb-2">Resident Summary</h4>
          <p className="text-sm mb-2">
            The community has a total of 418 residents across 175 units, with an average household size of 2.4 people. Homeowners make up 65% of the resident population, while 35% are renters.
          </p>
          <p className="text-sm">
            Resident turnover has decreased by 1.2% compared to last year, indicating improved resident satisfaction and community stability. The majority of residents (35%) have lived in the community for 5-10 years.
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="demographics" className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-base font-medium mb-4">Age Distribution</h4>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={[
                    { age: 'Under 18', count: 75 },
                    { age: '18-34', count: 95 },
                    { age: '35-49', count: 120 },
                    { age: '50-64', count: 85 },
                    { age: '65+', count: 43 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Number of Residents" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h4 className="text-base font-medium mb-4">Household Composition</h4>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Single Adult', value: 28 },
                      { name: 'Couple, No Children', value: 32 },
                      { name: 'Family with Children', value: 35 },
                      { name: 'Multigenerational', value: 5 },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {[0, 1, 2, 3].map((index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-md">
          <h4 className="text-base font-medium mb-2">Demographic Trends</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm mb-2">
                The community has a diverse age distribution with the largest segment being adults aged 35-49 (29%). Families with children represent 35% of all households, followed by couples without children at 32%.
              </p>
              <p className="text-sm">
                Compared to five years ago, there has been a 7% increase in residents aged 65 and older, reflecting an aging population trend that aligns with national demographics.
              </p>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-2">Key Demographics</h5>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Largest Age Group:</span>
                  <span className="text-sm font-medium">35-49 years (29%)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Households with Children:</span>
                  <span className="text-sm font-medium">35%</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Average Length of Residency:</span>
                  <span className="text-sm font-medium">6.2 years</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Senior Population (65+):</span>
                  <span className="text-sm font-medium">10.3%</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="movement" className="pt-4">
        <h4 className="text-base font-medium mb-4">Resident Move-In/Move-Out Trends</h4>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={movementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="moveIns" name="Move-Ins" stroke="#4ade80" strokeWidth={2} />
              <Line type="monotone" dataKey="moveOuts" name="Move-Outs" stroke="#f87171" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card>
            <CardContent className="p-4 flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Total Move-Ins (Year)</p>
              <p className="text-2xl font-bold">124</p>
              <p className="text-xs text-green-600">
                +8% vs last year
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Total Move-Outs (Year)</p>
              <p className="text-2xl font-bold">83</p>
              <p className="text-xs text-red-600">
                +3% vs last year
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Net Resident Growth</p>
              <p className="text-2xl font-bold">+41</p>
              <p className="text-xs text-green-600">
                +18% vs last year
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-md">
          <h4 className="text-base font-medium mb-2">Movement Analysis</h4>
          <p className="text-sm mb-2">
            Resident movement shows seasonal patterns with peak move-ins during spring and summer months (April-July). The net growth of 41 new residents indicates a healthy and attractive community.
          </p>
          <p className="text-sm">
            The average time to fill a vacant unit is 28 days, which is 15% faster than the previous year. This improvement can be attributed to enhanced marketing efforts and property upgrades.
          </p>
          
          <h5 className="text-sm font-medium mt-4 mb-2">Reason for Move-Outs (Top 3)</h5>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Job relocation (38%)</li>
            <li>Purchasing own home (24%)</li>
            <li>Need for larger/smaller space (18%)</li>
          </ul>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ResidentReports;
