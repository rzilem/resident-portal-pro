
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertCircle, CreditCard, Plus, Trash2, DollarSign, Check, Wallet, Building, Settings } from "lucide-react";
import { toast } from "sonner";

interface PaymentMethod {
  id: string;
  name: string;
  type: 'creditCard' | 'ach' | 'check' | 'cash' | 'other';
  enabled: boolean;
  processingFee?: number;
  passFeeToResident: boolean;
  isDefault?: boolean;
}

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { 
      id: 'pm_1',
      name: 'Credit Card', 
      type: 'creditCard', 
      enabled: true, 
      processingFee: 2.9, 
      passFeeToResident: true,
      isDefault: true
    },
    { 
      id: 'pm_2',
      name: 'ACH Transfer', 
      type: 'ach', 
      enabled: true, 
      processingFee: 0.8, 
      passFeeToResident: false
    },
    { 
      id: 'pm_3',
      name: 'Check', 
      type: 'check', 
      enabled: true, 
      processingFee: 0, 
      passFeeToResident: false
    },
    { 
      id: 'pm_4',
      name: 'Cash', 
      type: 'cash', 
      enabled: false, 
      processingFee: 0, 
      passFeeToResident: false
    }
  ]);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  
  const [newMethod, setNewMethod] = useState<Omit<PaymentMethod, 'id'>>({
    name: '',
    type: 'other',
    enabled: true,
    processingFee: 0,
    passFeeToResident: false
  });
  
  // Toggle payment method
  const toggleMethod = (id: string) => {
    const updatedMethods = paymentMethods.map(method => 
      method.id === id ? { ...method, enabled: !method.enabled } : method
    );
    setPaymentMethods(updatedMethods);
    
    const method = paymentMethods.find(m => m.id === id);
    toast.success(`${method?.name} ${method?.enabled ? 'disabled' : 'enabled'}`);
  };
  
  // Set default payment method
  const setDefaultMethod = (id: string) => {
    const updatedMethods = paymentMethods.map(method => 
      ({ ...method, isDefault: method.id === id })
    );
    setPaymentMethods(updatedMethods);
    
    const method = paymentMethods.find(m => m.id === id);
    toast.success(`${method?.name} set as default payment method`);
  };
  
  // Open configuration dialog
  const openConfigDialog = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setConfigDialogOpen(true);
  };
  
  // Update payment method configuration
  const updateMethodConfig = (updatedMethod: PaymentMethod) => {
    const updatedMethods = paymentMethods.map(method => 
      method.id === updatedMethod.id ? updatedMethod : method
    );
    setPaymentMethods(updatedMethods);
    setConfigDialogOpen(false);
    toast.success(`${updatedMethod.name} settings updated`);
  };
  
  // Handle new method input change
  const handleNewMethodChange = (field: keyof typeof newMethod, value: any) => {
    setNewMethod(prev => ({ ...prev, [field]: value }));
  };
  
  // Add new payment method
  const addPaymentMethod = () => {
    if (!newMethod.name) {
      toast.error("Please provide a payment method name");
      return;
    }
    
    const newId = `pm_${Date.now()}`;
    const method: PaymentMethod = {
      id: newId,
      ...newMethod,
      isDefault: paymentMethods.length === 0 // Make default if it's the first method
    };
    
    setPaymentMethods([...paymentMethods, method]);
    setDialogOpen(false);
    setNewMethod({
      name: '',
      type: 'other',
      enabled: true,
      processingFee: 0,
      passFeeToResident: false
    });
    
    toast.success(`${method.name} added as a payment method`);
  };
  
  // Delete payment method
  const deleteMethod = (id: string) => {
    const method = paymentMethods.find(m => m.id === id);
    
    if (method?.isDefault) {
      toast.error("Cannot delete the default payment method");
      return;
    }
    
    const updatedMethods = paymentMethods.filter(method => method.id !== id);
    setPaymentMethods(updatedMethods);
    toast.success(`${method?.name} removed`);
  };
  
  // Get icon for payment method type
  const getMethodIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'creditCard':
        return <CreditCard className="h-5 w-5" />;
      case 'ach':
        return <Wallet className="h-5 w-5" />;
      case 'check':
        return <DollarSign className="h-5 w-5" />;
      case 'cash':
        return <DollarSign className="h-5 w-5" />;
      default:
        return <DollarSign className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Configure how residents can pay their dues and fees</CardDescription>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Method
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            {paymentMethods.map((method, index) => (
              <div key={method.id}>
                {index > 0 && <Separator />}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-md ${method.enabled ? 'bg-primary/10' : 'bg-muted'}`}>
                      {getMethodIcon(method.type)}
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {method.name}
                        {method.isDefault && (
                          <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary rounded-md px-2 py-0.5">
                            <Check className="h-3 w-3" />
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {method.processingFee ? `${method.processingFee}% fee${method.passFeeToResident ? ' (passed to resident)' : ''}` : 'No processing fee'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={method.enabled} 
                      onCheckedChange={() => toggleMethod(method.id)} 
                    />
                    
                    <div className="flex items-center">
                      {!method.isDefault && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setDefaultMethod(method.id)}
                          className="text-xs h-8"
                        >
                          Set Default
                        </Button>
                      )}
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => openConfigDialog(method)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteMethod(method.id)}
                        disabled={method.isDefault}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Add New Payment Method Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Add a new way for residents to make payments
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Method Name</Label>
              <Input 
                id="name" 
                placeholder="e.g. Credit Card, PayPal, etc."
                value={newMethod.name}
                onChange={(e) => handleNewMethodChange('name', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="processingFee">Processing Fee (%)</Label>
              <Input 
                id="processingFee" 
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g. 2.9"
                value={newMethod.processingFee || ''}
                onChange={(e) => handleNewMethodChange('processingFee', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="passFeeToResident" 
                checked={newMethod.passFeeToResident} 
                onCheckedChange={(checked) => handleNewMethodChange('passFeeToResident', checked)}
              />
              <Label htmlFor="passFeeToResident">Pass fee to resident</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={addPaymentMethod}>Add Method</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Configure Payment Method Dialog */}
      {selectedMethod && (
        <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Configure {selectedMethod.name}</DialogTitle>
              <DialogDescription>
                Update the settings for this payment method
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Method Name</Label>
                <Input 
                  id="edit-name" 
                  value={selectedMethod.name}
                  onChange={(e) => setSelectedMethod({...selectedMethod, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-processingFee">Processing Fee (%)</Label>
                <Input 
                  id="edit-processingFee" 
                  type="number"
                  step="0.1"
                  min="0"
                  value={selectedMethod.processingFee || 0}
                  onChange={(e) => setSelectedMethod({
                    ...selectedMethod, 
                    processingFee: parseFloat(e.target.value) || 0
                  })}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="edit-passFeeToResident" 
                  checked={selectedMethod.passFeeToResident} 
                  onCheckedChange={(checked) => setSelectedMethod({
                    ...selectedMethod, 
                    passFeeToResident: checked
                  })}
                />
                <Label htmlFor="edit-passFeeToResident">Pass fee to resident</Label>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium">Payment Processor Integration</p>
                  <p>For full payment processing capabilities, connect to a payment processor in the Integrations settings.</p>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => updateMethodConfig(selectedMethod)}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PaymentMethods;
