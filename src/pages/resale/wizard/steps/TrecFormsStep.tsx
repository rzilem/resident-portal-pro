
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FormData } from '../types';

interface TrecFormsStepProps {
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const TrecFormsStep: React.FC<TrecFormsStepProps> = ({ formData, onInputChange }) => {
  const [selectedForms, setSelectedForms] = useState<string[]>(formData.selectedForms || []);

  const handleCheckboxChange = (formId: string, checked: boolean) => {
    let newSelected;
    if (checked) {
      newSelected = [...selectedForms, formId];
    } else {
      newSelected = selectedForms.filter(id => id !== formId);
    }
    
    setSelectedForms(newSelected);
    
    // Create a synthetic event to update the parent component
    const syntheticEvent = {
      target: {
        name: 'selectedForms',
        value: newSelected
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    onInputChange(syntheticEvent);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Select TREC forms required for your transaction.
      </p>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Required Forms</Label>
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="form-1" 
                checked={true} 
                disabled 
                onCheckedChange={(checked) => handleCheckboxChange('seller-disclosure', Boolean(checked))}
              />
              <Label htmlFor="form-1" className="font-normal">
                <div>Seller's Disclosure Notice (OP-H)</div>
                <div className="text-xs text-muted-foreground">Required for all property sales in Texas</div>
              </Label>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="form-2" 
                checked={true} 
                disabled 
                onCheckedChange={(checked) => handleCheckboxChange('condo-certificate', Boolean(checked))}
              />
              <Label htmlFor="form-2" className="font-normal">
                <div>Condominium Resale Certificate (OP-C)</div>
                <div className="text-xs text-muted-foreground">Required for condominium properties</div>
              </Label>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="form-3" 
                checked={true} 
                disabled 
                onCheckedChange={(checked) => handleCheckboxChange('hoa-addendum', Boolean(checked))}
              />
              <Label htmlFor="form-3" className="font-normal">
                <div>Addendum for Property Subject to HOA (OP-A)</div>
                <div className="text-xs text-muted-foreground">Required for properties in an HOA</div>
              </Label>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Optional Forms</Label>
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="form-4" 
                checked={selectedForms.includes('financing-addendum')} 
                onCheckedChange={(checked) => handleCheckboxChange('financing-addendum', Boolean(checked))}
              />
              <Label htmlFor="form-4" className="font-normal">
                <div>Third Party Financing Addendum (OP-F)</div>
                <div className="text-xs text-muted-foreground">For transactions involving third-party financing</div>
              </Label>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="form-5" 
                checked={selectedForms.includes('termination-notice')} 
                onCheckedChange={(checked) => handleCheckboxChange('termination-notice', Boolean(checked))}
              />
              <Label htmlFor="form-5" className="font-normal">
                <div>Notice of Buyer's Termination of Contract (OP-T)</div>
                <div className="text-xs text-muted-foreground">Optional form for buyer's contract termination</div>
              </Label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="rounded-md bg-blue-50 p-4 border border-blue-200 mt-4">
        <p className="text-blue-800 text-sm">
          Selected forms will be added to your document package. You can access and edit these forms at any time through the TREC Forms tab in the Resale Management dashboard.
        </p>
      </div>
    </div>
  );
};

export default TrecFormsStep;
