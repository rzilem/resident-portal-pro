
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { toast } from 'sonner';
import { 
  generateResidentTemplate,
  generatePropertyTemplate,
  generateViolationTemplate,
  generateFinancialTemplate,
  generateVendorTemplate,
  generateDocumentCategoriesTemplate,
  generateWorkOrderTemplate,
  generateBoardMembersTemplate,
  generateAmenitiesTemplate,
  generateAccountingCodesTemplate,
  generateUnitTemplate,
  generatePetTemplate,
  generateVehicleTemplate,
  generateCommitteesTemplate
} from '@/utils/templateExport';
import { generateOnboardingTemplate } from '@/utils/exportToExcel';

interface TemplatesTabProps {
  onOpenChange: () => void;
}

// Define a type for our templates
interface Template {
  id: number;
  name: string;
  description: string;
  format: string;
  size: string;
  generateFunction: () => void;
}

const TemplatesTab: React.FC<TemplatesTabProps> = ({ onOpenChange }) => {
  const handleDownloadTemplate = (template: Template) => {
    try {
      template.generateFunction();
      toast.success(`${template.name} template downloaded successfully`);
    } catch (error) {
      console.error('Error downloading template:', error);
      toast.error('Failed to download template');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div key={template.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <FileDown className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium">{template.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{template.description}</p>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Format: {template.format}</span>
              <span>{template.size}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={() => handleDownloadTemplate(template)}
            >
              Download Template
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

const templates: Template[] = [
  {
    id: 1,
    name: 'Resident Data',
    description: 'Template for importing homeowner and resident information',
    format: 'Excel',
    size: '12KB',
    generateFunction: generateResidentTemplate
  },
  {
    id: 2,
    name: 'Property Data',
    description: 'Template for importing property and unit information',
    format: 'Excel',
    size: '14KB',
    generateFunction: generatePropertyTemplate
  },
  {
    id: 3,
    name: 'Violation Types',
    description: 'Template for importing violation types and categories',
    format: 'Excel',
    size: '8KB',
    generateFunction: generateViolationTemplate
  },
  {
    id: 4,
    name: 'Financial Accounts',
    description: 'Template for importing GL accounts and financial data',
    format: 'Excel',
    size: '15KB',
    generateFunction: generateFinancialTemplate
  },
  {
    id: 5,
    name: 'Vendors',
    description: 'Template for importing vendor information',
    format: 'Excel',
    size: '10KB',
    generateFunction: generateVendorTemplate
  },
  {
    id: 6,
    name: 'Document Categories',
    description: 'Template for importing document structure',
    format: 'Excel',
    size: '6KB',
    generateFunction: generateDocumentCategoriesTemplate
  },
  {
    id: 7,
    name: 'Association Onboarding',
    description: 'Complete template for onboarding a new association',
    format: 'Excel',
    size: '20KB',
    generateFunction: generateOnboardingTemplate
  },
  {
    id: 8,
    name: 'Work Orders',
    description: 'Template for importing maintenance and work orders',
    format: 'Excel',
    size: '9KB',
    generateFunction: generateWorkOrderTemplate
  },
  {
    id: 9,
    name: 'Board Members',
    description: 'Template for importing board member information',
    format: 'Excel',
    size: '7KB',
    generateFunction: generateBoardMembersTemplate
  },
  {
    id: 10,
    name: 'Amenities',
    description: 'Template for importing amenity information',
    format: 'Excel',
    size: '8KB',
    generateFunction: generateAmenitiesTemplate
  },
  {
    id: 11,
    name: 'Accounting Codes',
    description: 'Template for importing chart of accounts',
    format: 'Excel',
    size: '11KB',
    generateFunction: generateAccountingCodesTemplate
  },
  {
    id: 12,
    name: 'Unit Information',
    description: 'Template for importing detailed unit/lot data',
    format: 'Excel',
    size: '13KB',
    generateFunction: generateUnitTemplate
  },
  {
    id: 13,
    name: 'Pet Registration',
    description: 'Template for importing resident pet information',
    format: 'Excel',
    size: '9KB',
    generateFunction: generatePetTemplate
  },
  {
    id: 14,
    name: 'Vehicle Registration',
    description: 'Template for importing resident vehicle information',
    format: 'Excel',
    size: '9KB',
    generateFunction: generateVehicleTemplate
  },
  {
    id: 15,
    name: 'Committee Members',
    description: 'Template for importing community committee members',
    format: 'Excel',
    size: '8KB',
    generateFunction: generateCommitteesTemplate
  }
];

export default TemplatesTab;
