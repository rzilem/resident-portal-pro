
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ClipboardList } from 'lucide-react';
import { FormData } from '../types';

interface CondoQuestionnaireStepProps {
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onGeneratePdf: (documentType: 'certificate' | 'questionnaire' | 'statement') => void;
}

const CondoQuestionnaireStep: React.FC<CondoQuestionnaireStepProps> = ({
  formData,
  onInputChange,
  onGeneratePdf,
}) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Complete the standardized condo questionnaire for lenders.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="condoName">Condominium Name</Label>
          <Input 
            id="condoName" 
            name="condoName" 
            value={formData.condoName}
            onChange={onInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="unitNumber">Unit Number</Label>
          <Input 
            id="unitNumber" 
            name="unitNumber" 
            value={formData.unitNumber}
            onChange={onInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="managementCompany">Management Company</Label>
          <Input 
            id="managementCompany" 
            name="managementCompany" 
            value={formData.managementCompany}
            onChange={onInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="totalUnits">Total Units</Label>
          <Input 
            id="totalUnits" 
            name="totalUnits" 
            value={formData.totalUnits}
            onChange={onInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="yearBuilt">Year Built</Label>
          <Input 
            id="yearBuilt" 
            name="yearBuilt" 
            value={formData.yearBuilt}
            onChange={onInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="monthlyFee">Monthly HOA Fee</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">$</span>
            <Input 
              id="monthlyFee" 
              name="monthlyFee" 
              value={formData.monthlyFee}
              onChange={onInputChange}
              className="rounded-l-none"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="reserveBalance">Reserve Fund Balance</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">$</span>
            <Input 
              id="reserveBalance" 
              name="reserveBalance" 
              value={formData.reserveBalance}
              onChange={onInputChange}
              className="rounded-l-none"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ownerOccupiedPercentage">Owner-Occupied Percentage</Label>
          <div className="flex">
            <Input 
              id="ownerOccupiedPercentage" 
              name="ownerOccupiedPercentage" 
              value={formData.ownerOccupiedPercentage}
              onChange={onInputChange}
              className="rounded-r-none"
            />
            <span className="inline-flex items-center px-3 bg-muted border border-l-0 border-input rounded-r-md">%</span>
          </div>
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label>Is the association involved in any litigation?</Label>
          <RadioGroup defaultValue="no" className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="litigation-yes" />
              <Label htmlFor="litigation-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="litigation-no" />
              <Label htmlFor="litigation-no">No</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={() => onGeneratePdf('questionnaire')}
          className="flex items-center gap-2"
        >
          <ClipboardList className="h-4 w-4" />
          <span>Generate Questionnaire PDF</span>
        </Button>
      </div>
    </div>
  );
};

export default CondoQuestionnaireStep;
