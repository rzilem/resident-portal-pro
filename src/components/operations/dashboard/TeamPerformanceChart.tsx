
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine,
  Label
} from 'recharts';

// Mock data for team performance
const data = [
  { name: 'Team A', responseTime: 2.5, completionRate: 92, taskCount: 145 },
  { name: 'Team B', responseTime: 1.8, completionRate: 97, taskCount: 132 },
  { name: 'Team C', responseTime: 3.2, completionRate: 85, taskCount: 121 },
  { name: 'Team D', responseTime: 2.1, completionRate: 93, taskCount: 158 },
  { name: 'Team E', responseTime: 2.7, completionRate: 89, taskCount: 113 },
  { name: 'Team F', responseTime: 1.9, completionRate: 95, taskCount: 127 },
];

const TeamPerformanceChart: React.FC = () => {
  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}
            formatter={(value, name) => {
              if (name === 'responseTime') return [`${value} hours`, 'Avg. Response Time'];
              if (name === 'completionRate') return [`${value}%`, 'Completion Rate'];
              return [value, name];
            }}
          />
          <Legend />
          <ReferenceLine yAxisId="right" y={90} stroke="green" strokeDasharray="3 3">
            <Label value="Target Completion Rate" position="insideTopRight" />
          </ReferenceLine>
          <ReferenceLine yAxisId="left" y={2.5} stroke="red" strokeDasharray="3 3">
            <Label value="Response Time Target" position="insideTopLeft" />
          </ReferenceLine>
          <Bar yAxisId="left" dataKey="responseTime" name="Avg. Response Time (hours)" fill="#8884d8" />
          <Bar yAxisId="right" dataKey="completionRate" name="Completion Rate (%)" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TeamPerformanceChart;
