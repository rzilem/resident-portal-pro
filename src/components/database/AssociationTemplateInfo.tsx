
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
    { field: "location", description: "Primary location of the association", example: "123 Main Street, Seattle, WA 98101", required: true },
    { field: "units", description: "Total number of units in the association", example: "120", required: true },
    { field: "status", description: "Current status of the association", example: "Active", required: true },
    { field: "onboarding_date", description: "Date the association was onboarded", example: "06/01/2023", required: true },
    { field: "annual_fees", description: "Total annual fees per unit", example: "2400", required: false },
    { field: "assessment_frequency", description: "How often assessments are collected", example: "Monthly", required: true },
    { field: "has_pool", description: "Whether the association has a pool (Yes/No)", example: "Yes", required: false },
    { field: "has_gate", description: "Whether the association has a gate (Yes/No)", example: "Yes", required: false },
    { field: "has_pedestrian_gate", description: "Whether the association has a pedestrian gate (Yes/No)", example: "No", required: false },
    { field: "county", description: "County where the association is located", example: "Travis", required: false },
    { field: "city", description: "City where the association is located", example: "Austin", required: true },
    { field: "state", description: "State where the association is located", example: "TX", required: true },
    { field: "zip", description: "ZIP code of the association", example: "78703", required: true },
    { field: "address", description: "Street address of the association", example: "789 Oak Avenue", required: true },
    { field: "offsite_addresses", description: "Number of offsite addresses", example: "5", required: false },
    { field: "leases", description: "Number of leased units", example: "12", required: false },
    { field: "service_type", description: "Type of service provided", example: "Full Service", required: false },
    { field: "association_type", description: "Type of association (HOA, Condo, etc.)", example: "HOA", required: true },
    { field: "founded_date", description: "Date the association was founded", example: "01/15/2005", required: false },
    { field: "contact_email", description: "Primary contact email for the association", example: "info@oakwoodheightshoa.com", required: true },
    { field: "contact_phone", description: "Primary contact phone for the association", example: "(555) 123-4567", required: true },
    { field: "contact_website", description: "Website of the association", example: "www.oakwoodheightshoa.com", required: false },
    { field: "tax_id", description: "Tax ID number of the association", example: "12-3456789", required: false },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Association Template Format</CardTitle>
        <CardDescription>
          This is the comprehensive format for bulk importing an entire association with all required data.
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
