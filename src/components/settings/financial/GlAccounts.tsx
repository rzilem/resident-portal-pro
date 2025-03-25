
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Association } from '@/components/settings/associations/types';
import { GLAccount } from '@/types/accounting';
import GlAccountMappingForm from './gl-accounts/GlAccountMappingForm';
import AssociationAccountsLink from './gl-accounts/AssociationAccountsLink';

interface GlAccountsProps {
  association: Association;
  handleSettingChange: (key: string, value: any) => Promise<void>;
  getSetting: (key: string, defaultValue: any) => any;
}

// Standard account mapping categories
const ACCOUNT_CATEGORIES = [
  { 
    id: 'revenueAccount', 
    label: 'Revenue Account', 
    description: 'Default account for association revenue and income'
  },
  { 
    id: 'expenseAccount', 
    label: 'Expense Account',
    description: 'Default account for general expenses'
  },
  { 
    id: 'assessmentAccount', 
    label: 'Assessment Account',
    description: 'Account for regular dues and assessments'
  },
  { 
    id: 'reserveAccount', 
    label: 'Reserve Account',
    description: 'Account for reserve funds'
  }
];

const GlAccounts: React.FC<GlAccountsProps> = ({ 
  association, 
  handleSettingChange, 
  getSetting 
}) => {
  const [accounts, setAccounts] = useState<GLAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get the current account mappings from settings or default to empty object
  const accountMappings = getSetting('glAccountMappings', {});
  
  // Mock loading accounts - in a real app, this would fetch from an API
  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    const timer = setTimeout(() => {
      // This would be replaced with actual account data
      setAccounts([
        { id: '1', code: '1000', name: 'Operating Fund', category: 'Assets', type: 'Asset', isActive: true },
        { id: '2', code: '2000', name: 'Accounts Payable', category: 'Liabilities', type: 'Liability', isActive: true },
        { id: '3', code: '3000', name: 'Reserve Fund', category: 'Equity', type: 'Equity', isActive: true },
        { id: '4', code: '4000', name: 'Assessment Income', category: 'Revenue', type: 'Income', isActive: true },
        { id: '5', code: '5000', name: 'Maintenance Expense', category: 'Expenses', type: 'Expense', isActive: true },
      ]);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [association.id]);

  // Handle saving account mappings
  const handleSaveMappings = async (newMappings: {[key: string]: string}) => {
    await handleSettingChange('glAccountMappings', newMappings);
    // In a real app you might want to show a success message
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>GL Accounts</CardTitle>
          <CardDescription>Configure the general ledger accounts for this association</CardDescription>
        </div>
        <AssociationAccountsLink />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="p-6 flex justify-center items-center min-h-[200px]">
            <p className="text-muted-foreground">Loading GL accounts...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="p-6 flex justify-center items-center min-h-[200px]">
            <p className="text-muted-foreground">No GL accounts found for this association.</p>
          </div>
        ) : (
          <GlAccountMappingForm
            accounts={accounts}
            mappings={accountMappings}
            onSave={handleSaveMappings}
            categories={ACCOUNT_CATEGORIES}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default GlAccounts;
