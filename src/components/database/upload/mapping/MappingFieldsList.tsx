
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';

interface MappingFieldsListProps {
  mappings: {
    sourceField: string;
    targetField: string;
  }[];
  fileData: {
    headers: string[];
    rows: Record<string, any>[];
  };
  onUpdateMapping: (index: number, targetField: string) => void;
  importType?: string;
}

const MappingFieldsList: React.FC<MappingFieldsListProps> = ({ 
  mappings, 
  fileData, 
  onUpdateMapping,
  importType = "association"
}) => {
  // Show a sample value from the first row
  const getSampleValue = (fieldName: string) => {
    if (fileData.rows.length === 0) return "No data";
    
    const value = fileData.rows[0][fieldName];
    if (value === undefined || value === null) return "Empty";
    
    return String(value).substring(0, 50);
  };
  
  // Get target field options based on import type
  const getTargetFieldOptions = () => {
    // Common address fields
    const addressFields = [
      { value: 'street', label: 'Street' },
      { value: 'city', label: 'City' },
      { value: 'state', label: 'State' },
      { value: 'zip', label: 'ZIP Code' },
      { value: 'country', label: 'Country' },
    ];
    
    // Common fields for all import types
    const commonFields = [
      { value: 'ignore', label: '-- Ignore Field --' },
      ...addressFields
    ];
    
    switch (importType) {
      case 'association':
        return [
          ...commonFields,
          { value: 'association_name', label: 'Association Name' },
          { value: 'association_address', label: 'Association Address' },
          { value: 'association_phone', label: 'Association Phone' },
          { value: 'association_email', label: 'Association Email' },
          { value: 'association_website', label: 'Association Website' },
          { value: 'association_type', label: 'Association Type' },
          { value: 'association_tax_id', label: 'Tax ID' },
          { value: 'property_units_count', label: 'Total Units' },
          { value: 'fiscal_year_start', label: 'Fiscal Year Start' },
          { value: 'fees_frequency', label: 'Fees Frequency' },
          { value: 'annual_fees', label: 'Annual Fees' },
        ];
      
      case 'property':
        return [
          ...commonFields,
          { value: 'property_name', label: 'Property Name' },
          { value: 'property_type', label: 'Property Type' },
          { value: 'property_address', label: 'Property Address' },
          { value: 'unit_number', label: 'Unit Number' },
          { value: 'unit_bedrooms', label: 'Bedrooms' },
          { value: 'unit_bathrooms', label: 'Bathrooms' },
          { value: 'unit_square_feet', label: 'Square Feet' },
          { value: 'property_year_built', label: 'Year Built' },
          { value: 'association_name', label: 'Association Name' },
        ];
      
      case 'resident':
        return [
          ...commonFields,
          { value: 'homeowner_first_name', label: 'First Name' },
          { value: 'homeowner_last_name', label: 'Last Name' },
          { value: 'homeowner_email', label: 'Email' },
          { value: 'homeowner_phone', label: 'Phone' },
          { value: 'property_address', label: 'Property Address' },
          { value: 'unit_number', label: 'Unit Number' },
          { value: 'resident_type', label: 'Resident Type' },
          { value: 'move_in_date', label: 'Move In Date' },
          { value: 'association_name', label: 'Association Name' },
        ];
      
      default:
        return commonFields;
    }
  };
  
  const targetFieldOptions = getTargetFieldOptions();

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Source Field</TableHead>
            <TableHead className="w-1/3">Target Field</TableHead>
            <TableHead className="w-1/3">Sample Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mappings.map((mapping, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{mapping.sourceField}</TableCell>
              <TableCell>
                <Select 
                  value={mapping.targetField || 'ignore'} 
                  onValueChange={(value) => onUpdateMapping(index, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select target field" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetFieldOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-muted-foreground truncate">
                {getSampleValue(mapping.sourceField)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MappingFieldsList;
