
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data
const mockData = {
  thisMonth: [
    { name: 'Week 1', austin: 140, roundRock: 110 },
    { name: 'Week 2', austin: 155, roundRock: 125 },
    { name: 'Week 3', austin: 162, roundRock: 130 },
    { name: 'Week 4', austin: 170, roundRock: 142 },
  ],
  lastMonth: [
    { name: 'Week 1', austin: 130, roundRock: 95 },
    { name: 'Week 2', austin: 145, roundRock: 110 },
    { name: 'Week 3', austin: 150, roundRock: 120 },
    { name: 'Week 4', austin: 160, roundRock: 135 },
  ],
  lastQuarter: [
    { name: 'Month 1', austin: 450, roundRock: 370 },
    { name: 'Month 2', austin: 480, roundRock: 390 },
    { name: 'Month 3', austin: 490, roundRock: 410 },
  ]
};

const OfficeMetricsChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState('thisMonth');
  const [metric, setMetric] = useState('requests');
  
  // Get data based on selected time range
  const data = mockData[timeRange as keyof typeof mockData];
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="thisMonth">This Month</SelectItem>
            <SelectItem value="lastMonth">Last Month</SelectItem>
            <SelectItem value="lastQuarter">Last Quarter</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={metric} onValueChange={setMetric}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="requests">Open Requests</SelectItem>
            <SelectItem value="responseTime">Response Time</SelectItem>
            <SelectItem value="satisfaction">Satisfaction</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
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
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0'
              }}
              formatter={(value, name) => {
                const formattedName = name === 'austin' ? 'Austin Office' : 'Round Rock Office';
                return [value, formattedName];
              }}
            />
            <Legend 
              formatter={(value) => value === 'austin' ? 'Austin Office' : 'Round Rock Office'} 
            />
            <Bar dataKey="austin" fill="#8884d8" />
            <Bar dataKey="roundRock" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OfficeMetricsChart;
