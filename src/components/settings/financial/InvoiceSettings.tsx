
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Association } from '../associations/types';
import { toast } from 'sonner';

interface InvoiceSettingsProps {
  association: Association;
  handleSettingChange: (key: string, value: any) => Promise<void>;
  getSetting: (key: string, defaultValue: any) => any;
}

const InvoiceSettings: React.FC<InvoiceSettingsProps> = ({ 
  association, 
  handleSettingChange,
  getSetting
}) => {
  const saveSettings = () => {
    toast.success("Invoice settings saved");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invoice Settings</CardTitle>
          <CardDescription>Configure how invoices are generated and managed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="prefix">Invoice Number Prefix</Label>
              <Input 
                id="prefix" 
                placeholder="INV-" 
                defaultValue={getSetting('invoicePrefix', 'INV-')}
                onChange={(e) => handleSettingChange('invoicePrefix', e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                This prefix will be added to all invoice numbers
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="terms">Default Payment Terms</Label>
              <Select 
                defaultValue={getSetting('defaultPaymentTerms', '30')}
                onValueChange={(value) => handleSettingChange('defaultPaymentTerms', value)}
              >
                <SelectTrigger id="terms">
                  <SelectValue placeholder="Select terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="45">45 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Default Invoice Notes</Label>
            <textarea 
              id="notes" 
              className="w-full min-h-[100px] p-2 border rounded-md"
              placeholder="Enter default notes to appear on invoices"
              defaultValue={getSetting('defaultInvoiceNotes', 'Thank you for your business.')}
              onChange={(e) => handleSettingChange('defaultInvoiceNotes', e.target.value)}
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Late Payment Settings</h3>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="enableLateFees" 
                checked={getSetting('enableLateFees', true)}
                onCheckedChange={(checked) => 
                  handleSettingChange('enableLateFees', checked)
                }
              />
              <Label htmlFor="enableLateFees">Enable late payment fees</Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="lateFeeDays">Days before late fee</Label>
                <Input 
                  id="lateFeeDays" 
                  type="number" 
                  defaultValue={getSetting('lateFeeDays', '10')}
                  onChange={(e) => handleSettingChange('lateFeeDays', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lateFeeAmount">Late fee amount (%)</Label>
                <Input 
                  id="lateFeeAmount" 
                  type="number" 
                  defaultValue={getSetting('lateFeePercentage', '5')}
                  onChange={(e) => handleSettingChange('lateFeePercentage', e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={saveSettings}>Save Invoice Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceSettings;
