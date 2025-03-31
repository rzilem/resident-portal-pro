
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const ResaleTrends: React.FC = () => {
  // Sample trends data
  const trends = [
    {
      name: 'Week 1',
      'Transactions': 32,
      'Revenue': 12500,
      'Completion Time': 3.5,
      'Resale Turnover': 4.2,
    },
    {
      name: 'Week 2',
      'Transactions': 28,
      'Revenue': 10800,
      'Completion Time': 3.7,
      'Resale Turnover': 4.0,
    },
    {
      name: 'Week 3',
      'Transactions': 35,
      'Revenue': 14200,
      'Completion Time': 3.3,
      'Resale Turnover': 4.5,
    },
    {
      name: 'Week 4',
      'Transactions': 42,
      'Revenue': 16500,
      'Completion Time': 3.0,
      'Resale Turnover': 5.1,
    },
    {
      name: 'Week 5',
      'Transactions': 38,
      'Revenue': 15200,
      'Completion Time': 3.2,
      'Resale Turnover': 4.8,
    },
    {
      name: 'Week 6',
      'Transactions': 45,
      'Revenue': 17800,
      'Completion Time': 2.9,
      'Resale Turnover': 5.3,
    },
    {
      name: 'Week 7',
      'Transactions': 50,
      'Revenue': 19500,
      'Completion Time': 2.8,
      'Resale Turnover': 5.7,
    },
    {
      name: 'Week 8',
      'Transactions': 48,
      'Revenue': 18900,
      'Completion Time': 2.9,
      'Resale Turnover': 5.5,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resale Trends</CardTitle>
        <CardDescription>
          Weekly trends for key performance indicators
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="Transactions" stroke="#8B5CF6" activeDot={{ r: 8 }} />
              <Line yAxisId="right" type="monotone" dataKey="Completion Time" stroke="#10B981" />
              <Line yAxisId="left" type="monotone" dataKey="Resale Turnover" stroke="#F59E0B" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
