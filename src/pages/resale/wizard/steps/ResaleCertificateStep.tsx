
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText } from 'lucide-react';
import { FormData } from '../types';

interface ResaleCertificateStepProps {
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onGeneratePdf: (documentType: 'certificate' | 'questionnaire' | 'statement') => void;
}

const ResaleCertificateStep: React.FC<ResaleCertificateStepProps> = ({
  formData,
  onInputChange,
  onSelectChange,
  onGeneratePdf,
}) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Generate a Texas-compliant resale certificate with auto-populated data.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="regularAssessment">Regular Assessment</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">$</span>
            <Input 
              id="regularAssessment" 
              name="regularAssessment" 
              placeholder="250.00" 
              value={formData.regularAssessment || ''}
              onChange={onInputChange}
              className="rounded-l-none"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="assessmentFrequency">Assessment Frequency</Label>
          <Select 
            value={formData.assessmentFrequency || 'monthly'} 
            onValueChange={(value) => onSelectChange('assessmentFrequency', value)}
          >
            <SelectTrigger id="assessmentFrequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="annually">Annually</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="specialAssessment">Special Assessment</Label>
          <Input 
            id="specialAssessment" 
            name="specialAssessment" 
            placeholder="None" 
            value={formData.specialAssessment || ''}
            onChange={onInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="transferFee">Transfer Fee</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">$</span>
            <Input 
              id="transferFee" 
              name="transferFee" 
              placeholder="150.00" 
              value={formData.transferFee || ''}
              onChange={onInputChange}
              className="rounded-l-none"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="outstandingBalance">Outstanding Balance</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">$</span>
            <Input 
              id="outstandingBalance" 
              name="outstandingBalance" 
              placeholder="0.00" 
              value={formData.outstandingBalance || ''}
              onChange={onInputChange}
              className="rounded-l-none"
            />
          </div>
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="violations">Violations</Label>
          <Textarea 
            id="violations" 
            name="violations" 
            placeholder="List any violations" 
            value={formData.violations || ''}
            onChange={onInputChange}
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="litigation">Litigation</Label>
          <Textarea 
            id="litigation" 
            name="litigation" 
            placeholder="List any pending litigation" 
            value={formData.litigation || ''}
            onChange={onInputChange}
          />
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={() => onGeneratePdf('certificate')}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          <span>Generate Certificate PDF</span>
        </Button>
      </div>
    </div>
  );
};

export default ResaleCertificateStep;
