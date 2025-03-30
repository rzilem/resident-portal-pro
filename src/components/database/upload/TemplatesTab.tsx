
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, FileText, FileUp, Download, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateOnboardingTemplate } from '@/utils/exportToExcel';

interface TemplatesTabProps {
  onOpenChange: (open: boolean) => void;
}

const TemplatesTab: React.FC<TemplatesTabProps> = ({ onOpenChange }) => {
  const [downloadingTemplate, setDownloadingTemplate] = useState<string | null>(null);
  
  // Template categories with descriptions
  const templates = [
    {
      id: 'association-onboarding',
      name: "Association Onboarding Template",
      description: "A comprehensive template for onboarding new associations with sample data.",
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      action: async () => {
        setDownloadingTemplate('association-onboarding');
        try {
          await generateOnboardingTemplate();
          toast.success("Association Onboarding Template downloaded");
        } catch (error) {
          console.error("Template download error:", error);
          toast.error("Failed to download template");
        } finally {
          setDownloadingTemplate(null);
        }
      }
    },
    {
      id: 'resident-import',
      name: "Resident Import Template",
      description: "Template for importing resident data into the system.",
      icon: <FileText className="h-5 w-5 text-green-500" />,
      action: async () => {
        setDownloadingTemplate('resident-import');
        try {
          // In a real app, this would generate a specific template
          // For now, we'll simulate a download delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Create a simple CSV template for resident import
          const csvContent = `First Name,Last Name,Email,Phone,Property Address,Unit Number,Resident Type,Move In Date
John,Doe,john.doe@example.com,555-123-4567,123 Main St,101,Owner,2022-01-01
Jane,Smith,jane.smith@example.com,555-987-6543,456 Oak Ave,202,Tenant,2022-06-15`;
          
          // Create a downloadable blob
          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'resident_import_template.csv';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          toast.success("Resident Import Template downloaded");
        } catch (error) {
          console.error("Template download error:", error);
          toast.error("Failed to download template");
        } finally {
          setDownloadingTemplate(null);
        }
      }
    },
    {
      id: 'financial-records',
      name: "Financial Records Template",
      description: "Template for importing financial records and transactions.",
      icon: <FileText className="h-5 w-5 text-amber-500" />,
      action: async () => {
        setDownloadingTemplate('financial-records');
        try {
          // In a real app, this would generate a specific template
          // For now, we'll simulate a download delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Create a simple CSV template for financial records
          const csvContent = `Date,Description,Category,Amount,Reference Number,Notes
2023-01-15,Monthly Assessment,Income,15000.00,REF123,January assessments
2023-01-20,Landscaping Service,Expense,2500.00,INV456,Regular maintenance
2023-01-25,Pool Repair,Expense,1200.00,INV789,Emergency repair`;
          
          // Create a downloadable blob
          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'financial_records_template.csv';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          toast.success("Financial Records Template downloaded");
        } catch (error) {
          console.error("Template download error:", error);
          toast.error("Failed to download template");
        } finally {
          setDownloadingTemplate(null);
        }
      }
    },
    {
      id: 'property-details',
      name: "Property Details Template",
      description: "Template for importing property details and unit information.",
      icon: <FileText className="h-5 w-5 text-purple-500" />,
      action: async () => {
        setDownloadingTemplate('property-details');
        try {
          // In a real app, this would generate a specific template
          // For now, we'll simulate a download delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Create a simple CSV template for property details
          const csvContent = `Address,Unit Number,City,State,Zip,Property Type,Bedrooms,Bathrooms,Square Feet
123 Main St,101,Springfield,IL,62701,Condo,2,2,1200
123 Main St,102,Springfield,IL,62701,Condo,1,1,800
456 Oak Ave,201,Springfield,IL,62702,Townhouse,3,2.5,1800`;
          
          // Create a downloadable blob
          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'property_details_template.csv';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          toast.success("Property Details Template downloaded");
        } catch (error) {
          console.error("Template download error:", error);
          toast.error("Failed to download template");
        } finally {
          setDownloadingTemplate(null);
        }
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-muted/40 rounded-lg p-4 text-sm">
        <h4 className="font-medium mb-2">Template Downloads</h4>
        <p>
          Download pre-formatted templates for importing data into the system.
          Using these templates ensures your data imports correctly without errors.
        </p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2">
        {templates.map((template) => (
          <div key={template.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              {template.icon}
              <h3 className="font-medium">{template.name}</h3>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {template.description}
            </p>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={template.action}
              disabled={downloadingTemplate === template.id}
            >
              {downloadingTemplate === template.id ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </>
              )}
            </Button>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <h4 className="font-medium mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Tips for Using Templates
        </h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Do not modify column names or delete required columns</li>
          <li>Follow the provided examples for proper data formatting</li>
          <li>For dates, use YYYY-MM-DD format (e.g., 2023-01-15)</li>
          <li>For large imports, consider splitting files into smaller chunks</li>
          <li>Save as Excel (.xlsx) or CSV format before uploading</li>
        </ul>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button onClick={() => onOpenChange(false)}>Close</Button>
      </div>
    </div>
  );
};

export default TemplatesTab;
