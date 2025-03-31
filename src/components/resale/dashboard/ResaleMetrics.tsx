
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Clock, Users, AlertTriangle } from 'lucide-react';

export const ResaleMetrics: React.FC = () => {
  // Sample metrics data
  const metrics = [
    {
      title: 'Total Transactions',
      value: '1,284',
      change: '+12.5%',
      isPositive: true,
      description: 'vs. previous period',
      icon: <Users className="h-8 w-8 text-blue-500" />,
    },
    {
      title: 'Revenue',
      value: '$142,384',
      change: '+8.2%',
      isPositive: true,
      description: 'vs. previous period',
      icon: <DollarSign className="h-8 w-8 text-green-500" />,
    },
    {
      title: 'Average Completion Time',
      value: '3.2 days',
      change: '-0.8 days',
      isPositive: true,
      description: 'vs. previous period',
      icon: <Clock className="h-8 w-8 text-amber-500" />,
    },
    {
      title: 'Pending Requests',
      value: '42',
      change: '+15.3%',
      isPositive: false,
      description: 'vs. previous period',
      icon: <AlertTriangle className="h-8 w-8 text-red-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            {metric.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center space-x-2 text-sm">
              {metric.isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <p className={metric.isPositive ? 'text-green-500' : 'text-red-500'}>
                {metric.change}
              </p>
              <p className="text-gray-500">{metric.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
