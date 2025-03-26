
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormData } from '../types';

interface PropertyDetailsStepProps {
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

const PropertyDetailsStep: React.FC<PropertyDetailsStepProps> = ({
  formData,
  onInputChange,
  onSelectChange,
}) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Please enter the property details to begin the resale process.</p>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="propertyAddress">Property Address</Label>
          <Input 
            id="propertyAddress" 
            name="propertyAddress" 
            placeholder="123 Main St, Austin, TX 78701" 
            value={formData.propertyAddress}
            onChange={onInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="propertyType">Property Type</Label>
          <Select 
            value={formData.propertyType} 
            onValueChange={(value) => onSelectChange('propertyType', value)}
          >
            <SelectTrigger id="propertyType">
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="condo">Condominium</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
              <SelectItem value="single-family">Single Family Home</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ownerName">Current Owner Name</Label>
          <Input 
            id="ownerName" 
            name="ownerName" 
            placeholder="John Doe" 
            value={formData.ownerName}
            onChange={onInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="associationName">Association Name</Label>
          <Input 
            id="associationName" 
            name="associationName" 
            placeholder="Sunset Heights HOA" 
            value={formData.associationName}
            onChange={onInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="closingDate">Closing Date</Label>
          <Input 
            id="closingDate" 
            name="closingDate" 
            type="date" 
            value={formData.closingDate}
            onChange={onInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsStep;
