
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CreditCard, Building, Receipt, DollarSign } from 'lucide-react';

interface PaymentStepProps {
  formData: {
    fees: {
      processing: number;
      rush: number;
      delivery: number;
      total: number;
    };
    property: {
      id: string;
      name: string;
      unit: string;
    };
    paymentMethod?: string;
    notes?: string;
  };
  onUpdate: (data: any) => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ formData, onUpdate }) => {
  const [paymentMethod, setPaymentMethod] = useState(formData.paymentMethod || 'creditCard');
  const [notes, setNotes] = useState(formData.notes || '');

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
    onUpdate({ paymentMethod: value });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    onUpdate({ notes: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Payment Information</h2>
        <p className="text-muted-foreground">Select how you would like to handle payment for this resale package</p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Property:</span>
              <span>{formData.property.name} - Unit {formData.property.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Document Processing:</span>
              <span>${formData.fees.processing.toFixed(2)}</span>
            </div>
            {formData.fees.rush > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rush Fee:</span>
                <span>${formData.fees.rush.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total Due:</span>
              <span>${formData.fees.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div>
        <h3 className="font-semibold mb-3">Payment Method</h3>
        <RadioGroup value={paymentMethod} onValueChange={handlePaymentMethodChange}>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="creditCard" id="creditCard" />
              <Label htmlFor="creditCard" className="flex items-center gap-2 cursor-pointer">
                <CreditCard className="h-4 w-4 text-blue-500" />
                <span>Credit Card Payment</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="escrow" id="escrow" />
              <Label htmlFor="escrow" className="flex items-center gap-2 cursor-pointer">
                <Building className="h-4 w-4 text-green-500" />
                <span>Collect at Closing/Escrow</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="invoice" id="invoice" />
              <Label htmlFor="invoice" className="flex items-center gap-2 cursor-pointer">
                <Receipt className="h-4 w-4 text-amber-500" />
                <span>Send Invoice to Title Company</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="homeowner" id="homeowner" />
              <Label htmlFor="homeowner" className="flex items-center gap-2 cursor-pointer">
                <DollarSign className="h-4 w-4 text-purple-500" />
                <span>Bill to Homeowner</span>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <h3 className="font-semibold mb-3">Additional Notes</h3>
        <Textarea
          placeholder="Add any special instructions or additional information here"
          className="min-h-[100px]"
          value={notes}
          onChange={handleNotesChange}
        />
      </div>
    </div>
  );
};

export default PaymentStep;
