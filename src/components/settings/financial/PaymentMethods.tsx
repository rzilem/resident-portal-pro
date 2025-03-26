
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Association } from '@/components/settings/associations/types';
import { usePaymentMethods } from './payment-methods/usePaymentMethods';
import PaymentMethodItem from './payment-methods/PaymentMethodItem';
import AddPaymentMethodDialog from './payment-methods/AddPaymentMethodDialog';
import EditPaymentMethodDialog from './payment-methods/EditPaymentMethodDialog';

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
  const {
    paymentMethods,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingMethod,
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
    isCustomMethod
  } = usePaymentMethods({ association, handleSettingChange, getSetting });

  const closeAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(false);
  };

  const closeEditDialog = () => {
    resetForm();
    setIsEditDialogOpen(false);
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
            <PaymentMethodItem
              key={method}
              method={method}
              config={config}
              onToggle={handleToggleMethod}
              onEdit={openEditDialog}
              onDelete={handleDeleteMethod}
              isCustomMethod={isCustomMethod}
            />
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
        <AddPaymentMethodDialog
          isOpen={isAddDialogOpen}
          onClose={closeAddDialog}
          newMethodName={newMethodName}
          setNewMethodName={setNewMethodName}
          newMethodFee={newMethodFee}
          setNewMethodFee={setNewMethodFee}
          newMethodFeeType={newMethodFeeType}
          setNewMethodFeeType={setNewMethodFeeType}
          onAdd={handleAddMethod}
        />

        {/* Edit Payment Method Dialog */}
        <EditPaymentMethodDialog
          isOpen={isEditDialogOpen}
          onClose={closeEditDialog}
          newMethodName={newMethodName}
          setNewMethodName={setNewMethodName}
          newMethodFee={newMethodFee}
          setNewMethodFee={setNewMethodFee}
          newMethodFeeType={newMethodFeeType}
          setNewMethodFeeType={setNewMethodFeeType}
          onEdit={handleEditMethod}
          onDelete={() => {
            if (editingMethod) {
              handleDeleteMethod(editingMethod);
              setIsEditDialogOpen(false);
            }
          }}
        />
      </CardContent>
    </Card>
  );
};

export default PaymentMethods;
