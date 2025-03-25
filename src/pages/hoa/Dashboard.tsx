
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bell, 
  Building2, 
  CreditCard, 
  FileText 
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // Sample data for payments chart
  const paymentData = {
    labels: ['January', 'February', 'March', 'April'],
    datasets: [
      {
        label: 'Payments Collected',
        data: [12000, 15000, 13000, 17000],
        backgroundColor: '#3B82F6',
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Collections',
      },
    },
  };

  // Stats cards data
  const statsCards = [
    { 
      title: 'Unpaid Dues', 
      value: '$5,230', 
      icon: <CreditCard className="h-6 w-6 text-red-500" />, 
      color: 'text-red-500',
      bg: 'bg-red-50' 
    },
    { 
      title: 'Open Requests', 
      value: '12', 
      icon: <FileText className="h-6 w-6 text-blue-500" />, 
      color: 'text-blue-500',
      bg: 'bg-blue-50'  
    },
    { 
      title: 'Upcoming Events', 
      value: '3', 
      icon: <Building2 className="h-6 w-6 text-green-500" />, 
      color: 'text-green-500',
      bg: 'bg-green-50'  
    },
    { 
      title: 'New Announcements', 
      value: '2', 
      icon: <Bell className="h-6 w-6 text-orange-500" />, 
      color: 'text-orange-500',
      bg: 'bg-orange-50'  
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
              </div>
              <div className={`p-3 rounded-full ${card.bg}`}>
                {card.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Payment Trends Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Payment Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Bar options={chartOptions} data={paymentData} />
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { date: "Apr 15", action: "Payment received from Unit 302", amount: "$250.00" },
              { date: "Apr 14", action: "New maintenance request submitted", amount: null },
              { date: "Apr 12", action: "Board meeting minutes uploaded", amount: null },
              { date: "Apr 10", action: "Payment received from Unit 105", amount: "$300.00" }
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center gap-4">
                  <p className="text-sm font-medium text-gray-500">{activity.date}</p>
                  <p className="text-gray-700">{activity.action}</p>
                </div>
                {activity.amount && (
                  <p className="font-medium text-green-600">{activity.amount}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
