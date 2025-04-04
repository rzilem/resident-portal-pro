
import React from 'react';
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
import { Card } from '@/components/ui/card';

// Mock data
const data = [
  { month: 'Jan', invoices: 65, arcRequests: 28, gateRequests: 42, poolRequests: 33, generalInquiries: 50 },
  { month: 'Feb', invoices: 59, arcRequests: 32, gateRequests: 38, poolRequests: 30, generalInquiries: 47 },
  { month: 'Mar', invoices: 80, arcRequests: 41, gateRequests: 35, poolRequests: 27, generalInquiries: 52 },
  { month: 'Apr', invoices: 81, arcRequests: 45, gateRequests: 37, poolRequests: 36, generalInquiries: 48 },
  { month: 'May', invoices: 56, arcRequests: 39, gateRequests: 44, poolRequests: 42, generalInquiries: 55 },
  { month: 'Jun', invoices: 55, arcRequests: 36, gateRequests: 48, poolRequests: 45, generalInquiries: 59 },
  { month: 'Jul', invoices: 40, arcRequests: 28, gateRequests: 52, poolRequests: 51, generalInquiries: 47 },
];

const OpenItemsChart: React.FC = () => {
  return (
    <div className="w-full h-[300px] mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }} 
          />
          <Legend />
          <Line type="monotone" dataKey="invoices" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
          <Line type="monotone" dataKey="arcRequests" stroke="#82ca9d" strokeWidth={2} />
          <Line type="monotone" dataKey="gateRequests" stroke="#ffc658" strokeWidth={2} />
          <Line type="monotone" dataKey="poolRequests" stroke="#ff8042" strokeWidth={2} />
          <Line type="monotone" dataKey="generalInquiries" stroke="#0088fe" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OpenItemsChart;
