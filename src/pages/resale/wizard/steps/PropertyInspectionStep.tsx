
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormData } from '../types';

interface PropertyInspectionStepProps {
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

const PropertyInspectionStep: React.FC<PropertyInspectionStepProps> = ({
  formData,
  onInputChange,
  onSelectChange
}) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Schedule and manage a property inspection with calendar integration.
      </p>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="inspectionDate">Preferred Inspection Date</Label>
          <Input 
            id="inspectionDate"
            name="inspectionDate" 
            type="date" 
            min={new Date().toISOString().split('T')[0]}
            value={typeof formData.inspectionDate === 'string' ? formData.inspectionDate : ''}
            onChange={onInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="inspectionTime">Preferred Time</Label>
          <Select 
            value={formData.inspectionTime || 'morning'}
            onValueChange={(value) => onSelectChange('inspectionTime', value)}
          >
            <SelectTrigger id="inspectionTime">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning (9am-12pm)</SelectItem>
              <SelectItem value="afternoon">Afternoon (1pm-4pm)</SelectItem>
              <SelectItem value="evening">Evening (5pm-7pm)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="inspectionType">Inspection Type</Label>
          <Select 
            value={formData.inspectionType || 'standard'}
            onValueChange={(value) => onSelectChange('inspectionType', value)}
          >
            <SelectTrigger id="inspectionType">
              <SelectValue placeholder="Select inspection type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Inspection</SelectItem>
              <SelectItem value="detailed">Detailed Inspection</SelectItem>
              <SelectItem value="follow-up">Follow-up Inspection</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="inspectionNotes">Notes for Inspector</Label>
          <Textarea 
            id="inspectionNotes"
            name="inspectionNotes"
            placeholder="Any special instructions or concerns"
            value={formData.inspectionNotes || ''}
            onChange={onInputChange}
          />
        </div>
      </div>
      
      <div className="rounded-md bg-amber-50 p-4 border border-amber-200 mt-4">
        <p className="text-amber-800 text-sm">
          Available inspection dates will be shown here from the calendar integration. 
          In a production environment, this would connect to your scheduling system.
        </p>
      </div>
    </div>
  );
};

export default PropertyInspectionStep;
