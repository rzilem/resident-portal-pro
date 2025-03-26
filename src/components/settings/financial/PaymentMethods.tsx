
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCard, CheckSquare, Building, Plus, Edit, X } from "lucide-react";
import { Association } from '@/components/settings/associations/types';
import { toast } from 'sonner';

interface PaymentMethodConfig {
  enabled: boolean;
  fee: number;
  feeType: 'percentage' | 'flat';
  icon?: string;
  customName?: string;
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

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<string | null>(null);
  const [newMethodName, setNewMethodName] = useState('');
  const [newMethodFee, setNewMethodFee] = useState('0');
  const [newMethodFeeType, setNewMethodFeeType] = useState<'percentage' | 'flat'>('flat');

  const handleToggleMethod = async (method: string) => {
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

  const handleAddMethod = async () => {
    if (!newMethodName.trim()) {
      toast.error('Please enter a payment method name');
      return;
    }

    const methodKey = `custom_${Date.now()}`;
    const updatedMethods = {
      ...paymentMethods,
      [methodKey]: {
        enabled: true,
        fee: parseFloat(newMethodFee) || 0,
        feeType: newMethodFeeType,
        customName: newMethodName
      }
    };

    setPaymentMethods(updatedMethods);
    await handleSettingChange('paymentMethods', updatedMethods);
    resetForm();
    setIsAddDialogOpen(false);
    toast.success(`${newMethodName} payment method added`);
  };

  const handleEditMethod = async () => {
    if (!editingMethod) return;
    
    const updatedMethods = {
      ...paymentMethods,
      [editingMethod]: {
        ...paymentMethods[editingMethod],
        fee: parseFloat(newMethodFee) || 0,
        feeType: newMethodFeeType,
        customName: newMethodName
      }
    };

    setPaymentMethods(updatedMethods);
    await handleSettingChange('paymentMethods', updatedMethods);
    resetForm();
    setIsEditDialogOpen(false);
    setEditingMethod(null);
    toast.success(`Payment method updated`);
  };

  const handleDeleteMethod = async (method: string) => {
    const isBuiltIn = ['creditCard', 'ach', 'check'].includes(method);
    if (isBuiltIn) {
      toast.error('Built-in payment methods cannot be deleted');
      return;
    }

    const updatedMethods = { ...paymentMethods };
    delete updatedMethods[method];

    setPaymentMethods(updatedMethods);
    await handleSettingChange('paymentMethods', updatedMethods);
    toast.success('Payment method deleted');
  };

  const openEditDialog = (method: string) => {
    setEditingMethod(method);
    const config = paymentMethods[method];
    setNewMethodName(config.customName || getMethodName(method));
    setNewMethodFee(config.fee.toString());
    setNewMethodFeeType(config.feeType);
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setNewMethodName('');
    setNewMethodFee('0');
    setNewMethodFeeType('flat');
  };

  const getMethodName = (method: string): string => {
    if (paymentMethods[method]?.customName) {
      return paymentMethods[method].customName as string;
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

  const isCustomMethod = (method: string) => {
    return !['creditCard', 'ach', 'check'].includes(method);
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
                {isCustomMethod(method) && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => openEditDialog(method)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                <Switch 
                  id={`${method}-toggle`}
                  checked={config.enabled}
                  onCheckedChange={() => handleToggleMethod(method)}
                />
                <Label htmlFor={`${method}-toggle`} className="cursor-pointer">
                  {config.enabled ? 'Enabled' : 'Disabled'}
                </Label>
                {isCustomMethod(method) && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-red-500"
                    onClick={() => handleDeleteMethod(method)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          <Button 
            className="w-full mt-4" 
            variant="outline"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Payment Method
          </Button>
        </div>

        {/* Add Payment Method Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Custom Payment Method</DialogTitle>
              <DialogDescription>
                Create a new payment method option for residents
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="method-name">Method Name</Label>
                <Input 
                  id="method-name" 
                  placeholder="e.g., PayPal, Venmo" 
                  value={newMethodName}
                  onChange={(e) => setNewMethodName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fee">Processing Fee</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="fee" 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    value={newMethodFee}
                    onChange={(e) => setNewMethodFee(e.target.value)}
                  />
                  <Select 
                    value={newMethodFeeType} 
                    onValueChange={(value) => setNewMethodFeeType(value as 'percentage' | 'flat')}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Fee Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="flat">Flat Fee ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                resetForm();
                setIsAddDialogOpen(false);
              }}>
                Cancel
              </Button>
              <Button onClick={handleAddMethod}>
                Add Payment Method
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Payment Method Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Payment Method</DialogTitle>
              <DialogDescription>
                Modify this payment method's settings
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-method-name">Method Name</Label>
                <Input 
                  id="edit-method-name" 
                  placeholder="e.g., PayPal, Venmo" 
                  value={newMethodName}
                  onChange={(e) => setNewMethodName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fee">Processing Fee</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="edit-fee" 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    value={newMethodFee}
                    onChange={(e) => setNewMethodFee(e.target.value)}
                  />
                  <Select 
                    value={newMethodFeeType} 
                    onValueChange={(value) => setNewMethodFeeType(value as 'percentage' | 'flat')}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Fee Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="flat">Flat Fee ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="destructive" 
                onClick={() => {
                  if (editingMethod) handleDeleteMethod(editingMethod);
                  setIsEditDialogOpen(false);
                }}
              >
                Delete
              </Button>
              <Button variant="outline" onClick={() => {
                resetForm();
                setIsEditDialogOpen(false);
              }}>
                Cancel
              </Button>
              <Button onClick={handleEditMethod}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PaymentMethods;
