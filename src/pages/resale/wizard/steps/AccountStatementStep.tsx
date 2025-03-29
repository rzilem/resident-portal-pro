
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DollarSign } from 'lucide-react';
import { FormData } from '../types';

interface AccountStatementStepProps {
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onGeneratePdf: (documentType: 'certificate' | 'questionnaire' | 'statement') => void;
}

const AccountStatementStep: React.FC<AccountStatementStepProps> = ({
  formData,
  onInputChange,
  onGeneratePdf,
}) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Generate a real-time statement of account showing the seller's current standing.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="accountNumber">Account Number</Label>
          <Input 
            id="accountNumber" 
            name="accountNumber" 
            value={formData.accountNumber || ''}
            onChange={onInputChange}
            readOnly
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="statementDate">Statement Date</Label>
          <Input 
            id="statementDate" 
            name="statementDate" 
            type="date" 
            value={typeof formData.statementDate === 'string' ? formData.statementDate : ''}
            onChange={onInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="previousBalance">Previous Balance</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">$</span>
            <Input 
              id="previousBalance" 
              name="previousBalance" 
              value={formData.previousBalance || ''}
              onChange={onInputChange}
              className="rounded-l-none"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="payments">Payments</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">$</span>
            <Input 
              id="payments" 
              name="payments" 
              value={formData.payments || ''}
              onChange={onInputChange}
              className="rounded-l-none"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="newCharges">New Charges</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">$</span>
            <Input 
              id="newCharges" 
              name="newCharges" 
              value={formData.newCharges || ''}
              onChange={onInputChange}
              className="rounded-l-none"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="currentBalance">Current Balance</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">$</span>
            <Input 
              id="currentBalance" 
              name="currentBalance" 
              value={formData.currentBalance || ''}
              onChange={onInputChange}
              className="rounded-l-none"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={() => onGeneratePdf('statement')}
          className="flex items-center gap-2"
        >
          <DollarSign className="h-4 w-4" />
          <span>Generate Statement PDF</span>
        </Button>
      </div>
    </div>
  );
};

export default AccountStatementStep;
