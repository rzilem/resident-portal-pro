
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Vendor } from '@/types/vendor';

interface VendorPerformanceData {
  name: string;
  responseTime: number;
  quality: number;
  onTimeDelivery: number;
}

interface VendorPerformanceChartProps {
  vendors: Vendor[];
}

const VendorPerformanceChart: React.FC<VendorPerformanceChartProps> = ({ vendors }) => {
  // In a real application, this data would come from an API
  // For now, we'll generate sample data based on the vendors
  const getPerformanceData = (): VendorPerformanceData[] => {
    return vendors.slice(0, 5).map(vendor => ({
      name: vendor.name.split(' ')[0], // Just use first word for readability
      responseTime: Math.floor(Math.random() * 40) + 60, // 60-100
      quality: Math.floor(Math.random() * 30) + 70, // 70-100
      onTimeDelivery: Math.floor(Math.random() * 35) + 65, // 65-100
    }));
  };

  const data = getPerformanceData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Performance Metrics</CardTitle>
        <CardDescription>Compare top vendors by key performance indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
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
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="responseTime" name="Response Time" fill="#8884d8" />
              <Bar dataKey="quality" name="Quality Rating" fill="#82ca9d" />
              <Bar dataKey="onTimeDelivery" name="On-time Delivery" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorPerformanceChart;
