
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Vendor } from '@/types/vendor';
import { addDays, isBefore, isAfter, differenceInDays } from 'date-fns';

interface InsuranceStatusData {
  name: string;
  value: number;
  color: string;
}

interface InsuranceExpirationChartProps {
  vendors: Vendor[];
}

const InsuranceExpirationChart: React.FC<InsuranceExpirationChartProps> = ({ vendors }) => {
  const getInsuranceStatus = () => {
    const today = new Date();
    const thirtyDaysFromNow = addDays(today, 30);
    const ninetyDaysFromNow = addDays(today, 90);
    
    let expired = 0;
    let expiringSoon = 0;
    let expiringLater = 0;
    let valid = 0;
    
    vendors.forEach(vendor => {
      if (!vendor.insurance || !vendor.insurance.expirationDate) {
        return;
      }
      
      const expirationDate = new Date(vendor.insurance.expirationDate);
      
      if (isBefore(expirationDate, today)) {
        expired++;
      } else if (isBefore(expirationDate, thirtyDaysFromNow)) {
        expiringSoon++;
      } else if (isBefore(expirationDate, ninetyDaysFromNow)) {
        expiringLater++;
      } else {
        valid++;
      }
    });
    
    return [
      { name: 'Expired', value: expired, color: '#ef4444' },
      { name: 'Expiring < 30 days', value: expiringSoon, color: '#f97316' },
      { name: 'Expiring < 90 days', value: expiringLater, color: '#facc15' },
      { name: 'Valid', value: valid, color: '#22c55e' }
    ];
  };

  const data = getInsuranceStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Insurance Status</CardTitle>
        <CardDescription>Overview of vendor insurance expiration status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} vendors`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsuranceExpirationChart;
