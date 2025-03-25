
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { GLAccount } from '@/types/accounting';

interface GlAccountSelectorProps {
  accounts: GLAccount[];
  selectedAccount: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
}

const GlAccountSelector: React.FC<GlAccountSelectorProps> = ({
  accounts,
  selectedAccount,
  onChange,
  label,
  placeholder = "Select an account"
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={label.toLowerCase().replace(/\s/g, '-')}>{label}</Label>
      <Select 
        value={selectedAccount} 
        onValueChange={onChange}
      >
        <SelectTrigger id={label.toLowerCase().replace(/\s/g, '-')}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {accounts.length === 0 ? (
            <SelectItem value="no-accounts" disabled>No accounts available</SelectItem>
          ) : (
            accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.code} - {account.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default GlAccountSelector;
