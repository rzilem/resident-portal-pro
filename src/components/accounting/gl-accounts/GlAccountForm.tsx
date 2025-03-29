
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { GLAccount } from '@/types/accounting';
import { DialogFooter } from "@/components/ui/dialog";

interface GlAccountFormProps {
  account: GLAccount | null;
  onSave: (account: GLAccount) => void;
  onCancel: () => void;
}

const GlAccountForm: React.FC<GlAccountFormProps> = ({ account, onSave, onCancel }) => {
  const [formData, setFormData] = useState<GLAccount>({
    id: '',
    code: '',
    name: '',
    category: '',
    type: '',
    isActive: true,
  });

  useEffect(() => {
    if (account) {
      setFormData(account);
    }
  }, [account]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTypeChange = (value: string) => {
    const categoryMap: Record<string, string> = {
      'Asset': 'Assets',
      'Liability': 'Liabilities',
      'Equity': 'Equity',
      'Income': 'Revenue',
      'Expense': 'Expenses'
    };

    setFormData({
      ...formData,
      type: value,
      category: categoryMap[value] || ''
    });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value
    });
  };

  const handleActiveChange = (checked: boolean) => {
    setFormData({
      ...formData,
      isActive: checked
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Account Code</Label>
          <Input
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Account Type</Label>
          <Select 
            value={formData.type || 'Asset'}
            onValueChange={handleTypeChange}
            required
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Asset">Asset</SelectItem>
              <SelectItem value="Liability">Liability</SelectItem>
              <SelectItem value="Equity">Equity</SelectItem>
              <SelectItem value="Income">Income</SelectItem>
              <SelectItem value="Expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="name">Account Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select 
          value={formData.category || 'Assets'}
          onValueChange={handleCategoryChange}
          required
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Assets">Assets</SelectItem>
            <SelectItem value="Liabilities">Liabilities</SelectItem>
            <SelectItem value="Equity">Equity</SelectItem>
            <SelectItem value="Revenue">Revenue</SelectItem>
            <SelectItem value="Expenses">Expenses</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="isActive" 
          checked={formData.isActive} 
          onCheckedChange={handleActiveChange}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {account ? 'Update' : 'Create'} Account
        </Button>
      </DialogFooter>
    </form>
  );
};

export default GlAccountForm;
