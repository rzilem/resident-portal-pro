
import { useState } from 'react';
import { toast } from 'sonner';
import { PaymentMethods } from './types';
import { Association } from '@/components/settings/associations/types';

interface UsePaymentMethodsProps {
  association: Association;
  handleSettingChange: (key: string, value: any) => Promise<void>;
  getSetting: (key: string, defaultValue: any) => any;
}

export const usePaymentMethods = ({ association, handleSettingChange, getSetting }: UsePaymentMethodsProps) => {
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

  const isCustomMethod = (method: string) => {
    return !['creditCard', 'ach', 'check'].includes(method);
  };

  return {
    paymentMethods,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingMethod,
    setEditingMethod,
    newMethodName,
    setNewMethodName,
    newMethodFee,
    setNewMethodFee,
    newMethodFeeType,
    setNewMethodFeeType,
    handleToggleMethod,
    handleAddMethod,
    handleEditMethod,
    handleDeleteMethod,
    openEditDialog,
    resetForm,
    getMethodName,
    isCustomMethod
  };
};
