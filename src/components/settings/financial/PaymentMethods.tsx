
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Association } from '@/components/settings/associations/types';

interface PaymentMethodsProps {
  association: Association;
  handleSettingChange: (key: string, value: any) => Promise<void>;
  getSetting: (key: string, defaultValue: any) => any;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ 
  association, 
  handleSettingChange, 
  getSetting 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Configure the payment methods available to residents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-6 flex justify-center items-center min-h-[200px]">
          <p className="text-muted-foreground">Payment methods configuration will be added here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethods;
