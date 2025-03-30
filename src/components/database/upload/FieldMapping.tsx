
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ColumnMapping {
  sourceField: string;
  targetField: string;
}

interface FieldMappingProps {
  fileData: {
    headers: string[];
    rows: Record<string, any>[];
  } | null;
  mappings: ColumnMapping[];
  onMappingsChange: (mappings: ColumnMapping[]) => void;
  onStepChange: (step: 'initial' | 'mapping' | 'validation') => void;
  onValidationPrepared: (validationResults: {
    total: number;
    valid: number;
    warnings: number;
    errors: number;
  }) => void;
}

const FieldMapping: React.FC<FieldMappingProps> = ({ 
  fileData, 
  mappings,
  onMappingsChange,
  onStepChange,
  onValidationPrepared
}) => {
  const handleUpdateMapping = (index: number, targetField: string) => {
    const updatedMappings = [...mappings];
    updatedMappings[index].targetField = targetField;
    onMappingsChange(updatedMappings);
  };

  const handleContinueToValidation = () => {
    if (!fileData) return;
    
    // Validate the mappings
    const requiredFields = [
      'association_name', 
      'association_address', 
      'association_phone', 
      'association_email', 
      'property_units_count'
    ];
    
    const mapped = mappings.map(m => m.targetField);
    
    const missingRequired = requiredFields.filter(field => !mapped.includes(field));
    
    if (missingRequired.length > 0) {
      toast.error(`Please map required fields: ${missingRequired.join(', ')}`);
      return;
    }
    
    // Process the data with mappings
    const totalRecords = fileData.rows.length || 0;
    let valid = 0;
    let warnings = 0;
    let errors = 0;
    
    // Simulate validation results based on data
    fileData.rows.forEach(row => {
      let hasWarning = false;
      let hasError = false;
      
      // Check for email format
      const emailMapping = mappings.find(m => m.targetField === 'association_email');
      if (emailMapping) {
        const email = row[emailMapping.sourceField];
        if (email && !email.toString().includes('@')) {
          hasWarning = true;
        }
      }
      
      // Check for empty required fields
      requiredFields.forEach(reqField => {
        const mapping = mappings.find(m => m.targetField === reqField);
        if (mapping) {
          const value = row[mapping.sourceField];
          if (!value) {
            hasError = true;
          }
        }
      });
      
      if (hasError) errors++;
      else if (hasWarning) warnings++;
      else valid++;
    });
    
    // Set validation results
    onValidationPrepared({
      total: totalRecords,
      valid,
      warnings,
      errors
    });
    
    onStepChange('validation');
  };

  if (!fileData) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Field Mapping</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Map your source data fields to system fields
      </p>
      
      <div className="bg-muted/30 p-3 rounded-md mb-4">
        <h4 className="font-medium text-sm mb-2">File Summary:</h4>
        <div className="text-sm flex flex-wrap gap-4">
          <div><span className="font-medium">Columns:</span> {fileData.headers.length}</div>
          <div><span className="font-medium">Rows:</span> {fileData.rows.length}</div>
        </div>
      </div>
      
      <div className="grid gap-4">
        {mappings.map((mapping, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex items-center">
              <span className="font-medium">{mapping.sourceField}</span>
              <span className="text-xs text-muted-foreground ml-2">
                ({fileData.rows[0]?.[mapping.sourceField] ? 
                  String(fileData.rows[0][mapping.sourceField]).slice(0, 20) + 
                  (String(fileData.rows[0][mapping.sourceField]).length > 20 ? '...' : '') : 
                  'no sample'})
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-medium">→</span>
            </div>
            <div className="flex items-center">
              <select
                className="border rounded p-1"
                value={mapping.targetField}
                onChange={(e) => handleUpdateMapping(index, e.target.value)}
              >
                <option value="">-- Select Field --</option>
                <optgroup label="Association Info">
                  <option value="association_name">Association Name</option>
                  <option value="association_address">Association Address</option>
                  <option value="association_phone">Association Phone</option>
                  <option value="association_email">Association Email</option>
                  <option value="association_tax_id">Association Tax ID</option>
                  <option value="association_type">Association Type</option>
                </optgroup>
                <optgroup label="Property Info">
                  <option value="property_name">Property Name</option>
                  <option value="property_type">Property Type</option>
                  <option value="property_year_built">Year Built</option>
                  <option value="property_units_count">Total Units</option>
                </optgroup>
                <optgroup label="Unit Info">
                  <option value="unit_number">Unit Number</option>
                  <option value="unit_address">Unit Address</option>
                  <option value="unit_bedrooms">Bedrooms</option>
                  <option value="unit_bathrooms">Bathrooms</option>
                  <option value="unit_square_feet">Square Feet</option>
                </optgroup>
                <optgroup label="Homeowner Info">
                  <option value="homeowner_id">Homeowner ID</option>
                  <option value="homeowner_first_name">First Name</option>
                  <option value="homeowner_last_name">Last Name</option>
                  <option value="homeowner_email">Email</option>
                  <option value="homeowner_phone">Phone</option>
                  <option value="homeowner_alternate_phone">Alternate Phone</option>
                  <option value="homeowner_mailing_address">Mailing Address</option>
                  <option value="homeowner_move_in_date">Move In Date</option>
                  <option value="homeowner_status">Status</option>
                  <option value="homeowner_type">Owner Type</option>
                  <option value="homeowner_primary_residence">Primary Residence</option>
                  <option value="homeowner_balance">Current Balance</option>
                  <option value="homeowner_last_payment_date">Last Payment Date</option>
                  <option value="homeowner_last_payment_amount">Last Payment Amount</option>
                  <option value="homeowner_payment_method">Payment Method</option>
                  <option value="homeowner_ach_start_date">ACH Start Date</option>
                  <option value="homeowner_closing_date">Closing Date</option>
                  <option value="homeowner_comm_preference">Communication Preference</option>
                  <option value="homeowner_billing_preference">Billing Preference</option>
                  <option value="homeowner_emergency_contact">Emergency Contact</option>
                  <option value="homeowner_board_member">Board Member</option>
                  <option value="homeowner_notes">Notes</option>
                </optgroup>
                <optgroup label="Address Components">
                  <option value="street">Street</option>
                  <option value="city">City</option>
                  <option value="state">State</option>
                  <option value="zip">ZIP Code</option>
                  <option value="country">Country</option>
                </optgroup>
                <optgroup label="Financial">
                  <option value="fiscal_year_start">Fiscal Year Start</option>
                  <option value="fees_frequency">Fees Frequency</option>
                  <option value="annual_fees">Annual Fees</option>
                </optgroup>
                <optgroup label="Other">
                  <option value="ignore">Ignore This Field</option>
                </optgroup>
              </select>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" onClick={() => onStepChange('initial')}>Back</Button>
        <Button onClick={handleContinueToValidation}>Continue to Validation</Button>
      </div>
    </div>
  );
};

export default FieldMapping;
