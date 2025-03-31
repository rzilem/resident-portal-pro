
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Clock, Package, FileCheck } from 'lucide-react';

interface StatsData {
  currentMonth: {
    transactions: number;
    revenue: string;
    avgCompletionTime: string;
    pendingRequests: number;
  };
  previousMonth: {
    transactions: number;
    revenue: string;
    avgCompletionTime: string;
    pendingRequests: number;
  };
  yearToDate: {
    transactions: number;
    revenue: string;
    avgCompletionTime: string;
    completedRequests: number;
  };
}

interface ResaleStatCardsProps {
  stats: StatsData;
}

export const ResaleStatCards: React.FC<ResaleStatCardsProps> = ({ stats }) => {
  // Calculate percentage changes
  const transactionChange = ((stats.currentMonth.transactions - stats.previousMonth.transactions) / stats.previousMonth.transactions) * 100;
  const revenueChange = ((parseFloat(stats.currentMonth.revenue.replace(/[^0-9.-]+/g, '')) - 
                         parseFloat(stats.previousMonth.revenue.replace(/[^0-9.-]+/g, ''))) / 
                         parseFloat(stats.previousMonth.revenue.replace(/[^0-9.-]+/g, ''))) * 100;
  const timeChange = ((parseFloat(stats.currentMonth.avgCompletionTime.replace(/[^0-9.-]+/g, '')) - 
                      parseFloat(stats.previousMonth.avgCompletionTime.replace(/[^0-9.-]+/g, ''))) / 
                      parseFloat(stats.previousMonth.avgCompletionTime.replace(/[^0-9.-]+/g, ''))) * 100;
  const pendingChange = ((stats.currentMonth.pendingRequests - stats.previousMonth.pendingRequests) / stats.previousMonth.pendingRequests) * 100;

  // When time decreases, that's positive. For pending requests, when they increase, that's negative.
  const timeIsPositive = timeChange <= 0;
  const pendingIsPositive = pendingChange <= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Statistics</CardTitle>
        <CardDescription>Month-to-date performance metrics compared to previous month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <Package className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.currentMonth.transactions}</div>
              <p className="text-xs text-muted-foreground">{stats.yearToDate.transactions} year to date</p>
              <div className="flex items-center space-x-2 text-sm mt-2">
                {transactionChange >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <p className={transactionChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {transactionChange.toFixed(1)}%
                </p>
                <p className="text-gray-500">vs. previous month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.currentMonth.revenue}</div>
              <p className="text-xs text-muted-foreground">{stats.yearToDate.revenue} year to date</p>
              <div className="flex items-center space-x-2 text-sm mt-2">
                {revenueChange >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <p className={revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {revenueChange.toFixed(1)}%
                </p>
                <p className="text-gray-500">vs. previous month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
              <Clock className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.currentMonth.avgCompletionTime}</div>
              <p className="text-xs text-muted-foreground">{stats.yearToDate.avgCompletionTime} year average</p>
              <div className="flex items-center space-x-2 text-sm mt-2">
                {timeIsPositive ? (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                )}
                <p className={timeIsPositive ? 'text-green-500' : 'text-red-500'}>
                  {Math.abs(timeChange).toFixed(1)}%
                </p>
                <p className="text-gray-500">vs. previous month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Requests</CardTitle>
              <FileCheck className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.currentMonth.transactions - stats.currentMonth.pendingRequests}</div>
              <p className="text-xs text-muted-foreground">{stats.yearToDate.completedRequests} year to date</p>
              <div className="flex items-center space-x-2 text-sm mt-2">
                {pendingIsPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <p className={pendingIsPositive ? 'text-green-500' : 'text-red-500'}>
                  {Math.abs(pendingChange).toFixed(1)}%
                </p>
                <p className="text-gray-500">completion rate</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
