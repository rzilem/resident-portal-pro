
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CreditCard, CheckSquare, Building, Plus } from "lucide-react";
import { Association } from '@/components/settings/associations/types';
import { toast } from 'sonner';

interface PaymentMethodConfig {
  enabled: boolean;
  fee: number;
  feeType: 'percentage' | 'flat';
}

interface PaymentMethods {
  creditCard: PaymentMethodConfig;
  ach: PaymentMethodConfig;
  check: PaymentMethodConfig;
  [key: string]: PaymentMethodConfig;
}

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
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods>(() => {
    return getSetting('paymentMethods', {
      creditCard: { enabled: true, fee: 2.9, feeType: 'percentage' },
      ach: { enabled: true, fee: 0.5, feeType: 'flat' },
      check: { enabled: true, fee: 0, feeType: 'flat' }
    });
  });

  const handleToggleMethod = async (method: 'creditCard' | 'ach' | 'check') => {
    const updatedMethods = {
      ...paymentMethods,
      [method]: {
        ...paymentMethods[method],
        enabled: !paymentMethods[method].enabled
      }
    };
    
    setPaymentMethods(updatedMethods);
    await handleSettingChange('paymentMethods', updatedMethods);
    toast.success(`${getMethodName(method)} ${updatedMethods[method].enabled ? 'enabled' : 'disabled'}`);
  };

  const getMethodName = (method: string): string => {
    switch(method) {
      case 'creditCard': return 'Credit Card';
      case 'ach': return 'Bank Transfer (ACH)';
      case 'check': return 'Check';
      default: return method;
    }
  };

  const getMethodIcon = (method: string) => {
    switch(method) {
      case 'creditCard': return <CreditCard className="h-5 w-5 text-blue-500" />;
      case 'ach': return <Building className="h-5 w-5 text-green-500" />;
      case 'check': return <CheckSquare className="h-5 w-5 text-amber-500" />;
      default: return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Configure the payment methods available to residents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(paymentMethods).map(([method, config]) => (
            <div key={method} className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center space-x-4">
                {getMethodIcon(method)}
                <div>
                  <h3 className="font-medium">{getMethodName(method)}</h3>
                  <p className="text-sm text-muted-foreground">
                    {config.fee > 0 ? `Fee: ${config.fee}${config.feeType === 'percentage' ? '%' : ' $'}` : 'No fee'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id={`${method}-toggle`}
                  checked={config.enabled}
                  onCheckedChange={() => handleToggleMethod(method as any)}
                />
                <Label htmlFor={`${method}-toggle`} className="cursor-pointer">
                  {config.enabled ? 'Enabled' : 'Disabled'}
                </Label>
              </div>
            </div>
          ))}
          
          <Button className="w-full mt-4" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Payment Method
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethods;
