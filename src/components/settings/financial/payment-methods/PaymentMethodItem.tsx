
import React from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CreditCard, CheckSquare, Building, Edit, X } from "lucide-react";
import { PaymentMethodConfig } from './types';

interface PaymentMethodItemProps {
  method: string;
  config: PaymentMethodConfig;
  onToggle: (method: string) => void;
  onEdit: (method: string) => void;
  onDelete: (method: string) => void;
  isCustomMethod: (method: string) => boolean;
}

const PaymentMethodItem: React.FC<PaymentMethodItemProps> = ({
  method,
  config,
  onToggle,
  onEdit,
  onDelete,
  isCustomMethod
}) => {
  const getMethodName = (method: string): string => {
    if (config?.customName) {
      return config.customName;
    }
    
    switch(method) {
      case 'creditCard': return 'Credit Card';
      case 'ach': return 'Bank Transfer (ACH)';
      case 'check': return 'Check';
      default: return method.replace('custom_', '');
    }
  };

  const getMethodIcon = (method: string) => {
    switch(method) {
      case 'creditCard': return <CreditCard className="h-5 w-5 text-blue-500" />;
      case 'ach': return <Building className="h-5 w-5 text-green-500" />;
      case 'check': return <CheckSquare className="h-5 w-5 text-amber-500" />;
      default: return <CreditCard className="h-5 w-5 text-purple-500" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-md">
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
        {isCustomMethod(method) && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onEdit(method)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
        <Switch 
          id={`${method}-toggle`}
          checked={config.enabled}
          onCheckedChange={() => onToggle(method)}
        />
        <Label htmlFor={`${method}-toggle`} className="cursor-pointer">
          {config.enabled ? 'Enabled' : 'Disabled'}
        </Label>
        {isCustomMethod(method) && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-red-500"
            onClick={() => onDelete(method)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodItem;
