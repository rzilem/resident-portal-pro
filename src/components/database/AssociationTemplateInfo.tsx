
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

/**
 * This component describes the format of the association template.
 * In a real application, this could be used to generate the actual Excel/CSV template.
 */
const AssociationTemplateInfo = () => {
  // Template columns structure
  const templateColumns = [
    { field: "association_name", description: "Name of the HOA or association", example: "Oakwood Heights HOA", required: true },
    { field: "association_address", description: "Primary address of the association", example: "123 Main Street, Seattle, WA 98101", required: true },
    { field: "association_phone", description: "Primary contact phone for the association", example: "(555) 123-4567", required: true },
    { field: "association_email", description: "Primary contact email for the association", example: "info@oakwoodheightshoa.com", required: true },
    { field: "association_tax_id", description: "Tax ID number of the association", example: "12-3456789", required: false },
    { field: "property_name", description: "Name of the property", example: "Oakwood Heights", required: true },
    { field: "property_type", description: "Type of property (Condo, Single Family, etc.)", example: "Condominium", required: true },
    { field: "property_year_built", description: "Year the property was built", example: "2005", required: false },
    { field: "property_units_count", description: "Total number of units in the property", example: "120", required: true },
    { field: "unit_number", description: "Unit number or identifier", example: "101", required: true },
    { field: "unit_address", description: "Full address of the unit", example: "123 Main Street, Unit 101, Seattle, WA 98101", required: true },
    { field: "unit_bedrooms", description: "Number of bedrooms in the unit", example: "2", required: false },
    { field: "unit_bathrooms", description: "Number of bathrooms in the unit", example: "2.5", required: false },
    { field: "unit_square_feet", description: "Square footage of the unit", example: "1200", required: false },
    { field: "homeowner_id", description: "Unique identifier for the homeowner (if exists)", example: "H001", required: false },
    { field: "homeowner_first_name", description: "First name of the homeowner", example: "Alice", required: true },
    { field: "homeowner_last_name", description: "Last name of the homeowner", example: "Johnson", required: true },
    { field: "homeowner_email", description: "Email address of the homeowner", example: "alice.j@example.com", required: true },
    { field: "homeowner_phone", description: "Phone number of the homeowner", example: "(555) 123-4567", required: true },
    { field: "homeowner_alternate_phone", description: "Alternate phone number", example: "(555) 987-6543", required: false },
    { field: "homeowner_mailing_address", description: "Mailing address if different from unit", example: "Same as unit or alternate address", required: false },
    { field: "homeowner_move_in_date", description: "Date homeowner moved in (MM/DD/YYYY)", example: "01/15/2020", required: true },
    { field: "homeowner_status", description: "Current status (Active, Inactive, Pending)", example: "Active", required: true },
    { field: "homeowner_type", description: "Owner or Tenant", example: "Owner", required: true },
    { field: "homeowner_primary_residence", description: "Is this their primary residence (Yes/No)", example: "Yes", required: true },
    { field: "homeowner_balance", description: "Current balance amount ($)", example: "$0.00", required: false },
    { field: "homeowner_last_payment_date", description: "Date of last payment (MM/DD/YYYY)", example: "05/01/2023", required: false },
    { field: "homeowner_last_payment_amount", description: "Amount of last payment ($)", example: "$350.00", required: false },
    { field: "homeowner_payment_method", description: "Preferred payment method", example: "Auto-draft", required: false },
    // New fields
    { field: "homeowner_ach_start_date", description: "Date ACH payments began (MM/DD/YYYY)", example: "01/15/2020", required: false },
    { field: "homeowner_closing_date", description: "Property closing date (MM/DD/YYYY)", example: "01/10/2020", required: false },
    { field: "homeowner_comm_preference", description: "Preferred communication method", example: "Email", required: false },
    { field: "homeowner_billing_preference", description: "Preferred billing method", example: "Email", required: false },
    { field: "homeowner_emergency_contact", description: "Emergency contact name and phone", example: "John Smith (555) 123-4567", required: false },
    { field: "homeowner_board_member", description: "Is a board member (Yes/No)", example: "No", required: false },
    { field: "homeowner_notes", description: "Additional notes about homeowner", example: "Board member 2020-2022", required: false },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Association Template Format</CardTitle>
        <CardDescription>
          This is the comprehensive format for bulk importing an entire association with all homeowner data.
          Download this template to ensure your data is formatted correctly for import.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-auto max-h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Column Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Example</TableHead>
                <TableHead>Required</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templateColumns.map((column, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{column.field}</TableCell>
                  <TableCell>{column.description}</TableCell>
                  <TableCell className="text-muted-foreground">{column.example}</TableCell>
                  <TableCell>
                    {column.required ? 
                      <span className="text-destructive font-medium">Yes</span> : 
                      <span className="text-muted-foreground">No</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssociationTemplateInfo;
