
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

interface VendorMappingFieldsListProps {
  mappings: {
    sourceField: string;
    targetField: string;
  }[];
  fileData: {
    headers: string[];
    rows: Record<string, any>[];
  };
  onUpdateMapping: (index: number, targetField: string) => void;
}

const VendorMappingFieldsList: React.FC<VendorMappingFieldsListProps> = ({ 
  mappings, 
  fileData, 
  onUpdateMapping 
}) => {
  // Show a sample value from the first row
  const getSampleValue = (fieldName: string) => {
    if (fileData.rows.length === 0) return "No data";
    
    const value = fileData.rows[0][fieldName];
    if (value === undefined || value === null) return "Empty";
    
    return String(value).substring(0, 50);
  };
  
  // Get vendor field options
  const getVendorFieldOptions = () => {
    return [
      { value: 'ignore', label: '-- Ignore Field --' },
      { value: 'name', label: 'Vendor Name' },
      { value: 'contact_name', label: 'Contact Name' },
      { value: 'email', label: 'Email' },
      { value: 'phone', label: 'Phone' },
      { value: 'address', label: 'Address (Full)' },
      { value: 'address1', label: 'Address Line 1' },
      { value: 'address2', label: 'Address Line 2' },
      { value: 'city', label: 'City' },
      { value: 'state', label: 'State' },
      { value: 'zip', label: 'ZIP Code' },
      { value: 'category', label: 'Category' },
      { value: 'status', label: 'Status' },
      { value: 'payment_terms', label: 'Payment Terms' },
      { value: 'payment_method', label: 'Payment Method' },
      { value: 'tax_id', label: 'Tax ID' },
      { value: 'notes', label: 'Notes' },
      { value: 'provider_type', label: 'Provider Type' },
      { value: 'is_preferred', label: 'Is Preferred' },
      { value: 'is_1099', label: 'Is 1099' },
      { value: 'default_payment_method', label: 'Default Payment Method' },
    ];
  };

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
                    {getVendorFieldOptions().map((option) => (
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

export default VendorMappingFieldsList;
