
import React from 'react';
import { ColumnMapping } from '@/utils/spreadsheets/autoMapping';

interface MappingFieldProps {
  mapping: ColumnMapping;
  index: number;
  sampleValue: string | null;
  onUpdateMapping: (index: number, targetField: string) => void;
}

const MappingField: React.FC<MappingFieldProps> = ({
  mapping,
  index,
  sampleValue,
  onUpdateMapping
}) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md">
      <div className="flex items-center">
        <span className="font-medium">{mapping.sourceField}</span>
        <span className="text-xs text-muted-foreground ml-2">
          ({sampleValue ? 
            String(sampleValue).slice(0, 20) + 
            (String(sampleValue).length > 20 ? '...' : '') : 
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
          onChange={(e) => onUpdateMapping(index, e.target.value)}
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
  );
};

export default MappingField;
