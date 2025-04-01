
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Search } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface PropertyDetailsStepProps {
  formData: any;
  onUpdate: (data: any) => void;
}

const PropertyDetailsStep: React.FC<PropertyDetailsStepProps> = ({
  formData,
  onUpdate,
}) => {
  // Mock data for demonstration
  const associations = [
    { id: '1', name: 'Downtown Living HOA' },
    { id: '2', name: 'Sunset Ridge Condos' },
    { id: '3', name: 'Pinewood Estates' }
  ];

  const handleSelectAssociation = (id: string) => {
    const selected = associations.find(a => a.id === id);
    onUpdate({ 
      id: selected?.id || '', 
      name: selected?.name || '' 
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleDateChange = (date: Date | undefined) => {
    onUpdate({ 
      ...formData, 
      closingDate: date 
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Select the property and association for this resale request.
      </p>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="associationId">Association</Label>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Select 
                  value={formData.id || ''} 
                  onValueChange={handleSelectAssociation}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an association" />
                  </SelectTrigger>
                  <SelectContent>
                    {associations.map(assoc => (
                      <SelectItem key={assoc.id} value={assoc.id}>{assoc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TooltipTrigger>
              <TooltipContent side="right" className="z-50">
                <p>Select the HOA or condo association for this property</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Property Address</Label>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="address" 
                    name="address"
                    placeholder="Search for property address" 
                    value={formData.address || ''}
                    onChange={handleChange}
                    className="pl-9"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="z-50">
                <p>Enter the full property address including unit number</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="unit">Unit Number</Label>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Input 
                  id="unit" 
                  name="unit" 
                  placeholder="Unit/Apt #" 
                  value={formData.unit || ''}
                  onChange={handleChange}
                />
              </TooltipTrigger>
              <TooltipContent side="right" className="z-50">
                <p>Enter unit number if applicable</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="closingDate">Expected Closing Date</Label>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <DatePicker 
                    date={formData.closingDate} 
                    onDateChange={handleDateChange}
                    disablePastDates
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="z-50">
                <p>Select the expected property closing date</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsStep;
