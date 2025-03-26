
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Association } from '@/components/settings/associations/types';
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
  const [invoiceSettings, setInvoiceSettings] = useState(() => {
    return getSetting('invoiceSettings', {
      prefix: 'INV-',
      nextNumber: 1001,
      dueDays: 30,
      autoSend: true,
      sendReminders: true,
      reminderDays: [7, 3, 1],
      lateFee: {
        enabled: true,
        amount: 25,
        type: 'flat'
      },
      terms: 'Payment is due within 30 days of invoice date. Late payments are subject to fees.'
    });
  });

  const handleChange = (key: string, value: any) => {
    const updatedSettings = { ...invoiceSettings, [key]: value };
    setInvoiceSettings(updatedSettings);
  };

  const handleNestedChange = (parent: string, key: string, value: any) => {
    const updatedSettings = {
      ...invoiceSettings,
      [parent]: {
        ...invoiceSettings[parent],
        [key]: value
      }
    };
    setInvoiceSettings(updatedSettings);
  };

  const saveSettings = async () => {
    await handleSettingChange('invoiceSettings', invoiceSettings);
    toast.success('Invoice settings saved successfully');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Settings</CardTitle>
        <CardDescription>Configure how invoices are generated and managed</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="prefix">Invoice Number Prefix</Label>
              <Input 
                id="prefix" 
                value={invoiceSettings.prefix} 
                onChange={(e) => handleChange('prefix', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nextNumber">Next Invoice Number</Label>
              <Input 
                id="nextNumber" 
                type="number" 
                value={invoiceSettings.nextNumber} 
                onChange={(e) => handleChange('nextNumber', parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDays">Default Payment Terms (days)</Label>
              <Input 
                id="dueDays" 
                type="number" 
                value={invoiceSettings.dueDays} 
                onChange={(e) => handleChange('dueDays', parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lateFeeAmount">Late Fee</Label>
              <div className="flex space-x-2">
                <Input 
                  id="lateFeeAmount" 
                  type="number" 
                  value={invoiceSettings.lateFee.amount} 
                  onChange={(e) => handleNestedChange('lateFee', 'amount', parseFloat(e.target.value))}
                  disabled={!invoiceSettings.lateFee.enabled}
                />
                <Select 
                  value={invoiceSettings.lateFee.type} 
                  onValueChange={(value) => handleNestedChange('lateFee', 'type', value)}
                  disabled={!invoiceSettings.lateFee.enabled}
                >
                  <SelectTrigger className="w-[110px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flat">Flat ($)</SelectItem>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Enable Late Fees</h3>
                <p className="text-sm text-muted-foreground">Apply fees to overdue invoices</p>
              </div>
              <Switch 
                checked={invoiceSettings.lateFee.enabled}
                onCheckedChange={(checked) => handleNestedChange('lateFee', 'enabled', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Automatic Invoice Delivery</h3>
                <p className="text-sm text-muted-foreground">Send invoices via email when generated</p>
              </div>
              <Switch 
                checked={invoiceSettings.autoSend}
                onCheckedChange={(checked) => handleChange('autoSend', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Payment Reminders</h3>
                <p className="text-sm text-muted-foreground">Send reminders before due date</p>
              </div>
              <Switch 
                checked={invoiceSettings.sendReminders}
                onCheckedChange={(checked) => handleChange('sendReminders', checked)}
              />
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <Label htmlFor="terms">Default Invoice Terms</Label>
            <textarea 
              id="terms"
              className="w-full mt-2 p-2 min-h-[100px] border rounded-md"
              value={invoiceSettings.terms}
              onChange={(e) => handleChange('terms', e.target.value)}
            />
          </div>
          
          <div className="flex justify-end">
            <Button onClick={saveSettings}>Save Settings</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceSettings;
