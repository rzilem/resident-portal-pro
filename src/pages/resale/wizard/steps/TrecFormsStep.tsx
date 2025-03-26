
import React from 'react';
import { Label } from '@/components/ui/label';

const TrecFormsStep: React.FC = () => {
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
              <input type="checkbox" id="form-1" className="mt-1" checked readOnly />
              <Label htmlFor="form-1" className="font-normal">
                <div>Seller's Disclosure Notice (OP-H)</div>
                <div className="text-xs text-muted-foreground">Required for all property sales in Texas</div>
              </Label>
            </div>
            
            <div className="flex items-start space-x-2">
              <input type="checkbox" id="form-2" className="mt-1" checked readOnly />
              <Label htmlFor="form-2" className="font-normal">
                <div>Condominium Resale Certificate (OP-C)</div>
                <div className="text-xs text-muted-foreground">Required for condominium properties</div>
              </Label>
            </div>
            
            <div className="flex items-start space-x-2">
              <input type="checkbox" id="form-3" className="mt-1" checked readOnly />
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
              <input type="checkbox" id="form-4" className="mt-1" />
              <Label htmlFor="form-4" className="font-normal">
                <div>Third Party Financing Addendum (OP-F)</div>
                <div className="text-xs text-muted-foreground">For transactions involving third-party financing</div>
              </Label>
            </div>
            
            <div className="flex items-start space-x-2">
              <input type="checkbox" id="form-5" className="mt-1" />
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
