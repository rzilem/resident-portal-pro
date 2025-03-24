
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface FinancialSettingsProps {
  handleSettingChange: (settingName: string, value: any) => void;
  getSetting: (key: string, fallback?: any) => any;
}

const FinancialSettings = ({ handleSettingChange, getSetting }: FinancialSettingsProps) => {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Fiscal Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fiscal-year-start">Fiscal Year Start (MM/DD)</Label>
            <Input 
              id="fiscal-year-start"
              value={getSetting('fiscalYearStart', '01/01')}
              onChange={(e) => handleSettingChange('fiscalYearStart', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={getSetting('currency', 'USD')}
              onValueChange={(value) => handleSettingChange('currency', value)}
            >
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="CAD">CAD (C$)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currency-symbol">Currency Symbol</Label>
            <Input 
              id="currency-symbol"
              value={getSetting('currencySymbol', '$')}
              onChange={(e) => handleSettingChange('currencySymbol', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="due-day">Monthly Due Day</Label>
            <Select
              value={getSetting('dueDay', '1')}
              onValueChange={(value) => handleSettingChange('dueDay', value)}
            >
              <SelectTrigger id="due-day">
                <SelectValue placeholder="Select due day" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                  <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Payment Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="allow-online-payments">Allow Online Payments</Label>
              <Switch 
                id="allow-online-payments"
                checked={getSetting('allowOnlinePayments', true)}
                onCheckedChange={(checked) => handleSettingChange('allowOnlinePayments', checked)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="allow-autopay">Allow AutoPay Enrollment</Label>
              <Switch 
                id="allow-autopay"
                checked={getSetting('allowAutopay', true)}
                onCheckedChange={(checked) => handleSettingChange('allowAutopay', checked)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="charge-convenience-fee">Charge Convenience Fee</Label>
              <Switch 
                id="charge-convenience-fee"
                checked={getSetting('chargeConvenienceFee', false)}
                onCheckedChange={(checked) => handleSettingChange('chargeConvenienceFee', checked)}
              />
            </div>
          </div>
          
          {getSetting('chargeConvenienceFee', false) && (
            <div className="space-y-2">
              <Label htmlFor="convenience-fee">Convenience Fee (%)</Label>
              <Input 
                id="convenience-fee"
                type="number"
                value={getSetting('convenienceFee', '3.0')}
                onChange={(e) => handleSettingChange('convenienceFee', e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
      
      <Separator />
      
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Late Fee Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-late-fees">Enable Late Fees</Label>
              <Switch 
                id="enable-late-fees"
                checked={getSetting('enableLateFees', true)}
                onCheckedChange={(checked) => handleSettingChange('enableLateFees', checked)}
              />
            </div>
          </div>
          
          {getSetting('enableLateFees', true) && (
            <>
              <div className="space-y-2">
                <Label htmlFor="late-fee-type">Late Fee Type</Label>
                <Select
                  value={getSetting('lateFeeType', 'fixed')}
                  onValueChange={(value) => handleSettingChange('lateFeeType', value)}
                >
                  <SelectTrigger id="late-fee-type">
                    <SelectValue placeholder="Select late fee type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="late-fee-amount">
                  {getSetting('lateFeeType', 'fixed') === 'fixed' 
                    ? 'Late Fee Amount' 
                    : 'Late Fee Percentage'}
                </Label>
                <div className="flex">
                  {getSetting('lateFeeType', 'fixed') === 'fixed' && (
                    <span className="flex items-center bg-muted px-3 rounded-l-md border-y border-l border-input">
                      {getSetting('currencySymbol', '$')}
                    </span>
                  )}
                  <Input 
                    id="late-fee-amount"
                    type="number"
                    className={getSetting('lateFeeType', 'fixed') === 'fixed' ? "rounded-l-none" : ""}
                    value={getSetting('lateFeeAmount', '25')}
                    onChange={(e) => handleSettingChange('lateFeeAmount', e.target.value)}
                  />
                  {getSetting('lateFeeType', 'fixed') === 'percentage' && (
                    <span className="flex items-center bg-muted px-3 rounded-r-md border-y border-r border-input">
                      %
                    </span>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="late-fee-grace-days">Grace Period (Days)</Label>
                <Input 
                  id="late-fee-grace-days"
                  type="number"
                  value={getSetting('lateFeeGraceDays', '10')}
                  onChange={(e) => handleSettingChange('lateFeeGraceDays', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="compound-late-fees">Compound Late Fees Monthly</Label>
                  <Switch 
                    id="compound-late-fees"
                    checked={getSetting('compoundLateFees', false)}
                    onCheckedChange={(checked) => handleSettingChange('compoundLateFees', checked)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialSettings;
