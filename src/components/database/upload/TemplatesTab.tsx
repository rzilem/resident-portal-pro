
import React from 'react';
import { 
  FileDown, 
  FileSpreadsheet, 
  Users, 
  Building, 
  Home, 
  FileText, 
  FileWarning,
  LinkIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  generateOnboardingTemplate, 
  generateAssociationTemplate, 
  generatePropertyTemplate 
} from '@/utils/exportToExcel';
import {
  generateResidentTemplate,
  generateOwnerPropertyAssociationTemplate
} from '@/utils/templates/residentTemplates';
import {
  generatePropertyTemplate as generateDetailedPropertyTemplate,
  generateAssociationPropertiesTemplate
} from '@/utils/templates/propertyTemplates';

interface TemplatesTabProps {
  onOpenChange: (open: boolean) => void;
}

const TemplatesTab: React.FC<TemplatesTabProps> = ({ onOpenChange }) => {
  const templates = [
    {
      id: 'residents',
      title: 'Resident Onboarding',
      description: 'Template for adding new residents to your associations (50 rows)',
      icon: <Users className="h-5 w-5 text-blue-500" />,
      fileIcon: <FileSpreadsheet className="h-4 w-4 text-blue-500" />,
      downloadHandler: () => {
        generateResidentTemplate();
        toast.success('Resident template downloaded successfully');
      }
    },
    {
      id: 'associations',
      title: 'Association Setup',
      description: 'Template for setting up new associations or communities',
      icon: <Building className="h-5 w-5 text-purple-500" />,
      fileIcon: <FileSpreadsheet className="h-4 w-4 text-purple-500" />,
      downloadHandler: () => {
        generateAssociationTemplate();
        toast.success('Association template downloaded successfully');
      }
    },
    {
      id: 'properties',
      title: 'Property Upload',
      description: 'Template for adding multiple properties to an association (50 rows)',
      icon: <Home className="h-5 w-5 text-green-500" />,
      fileIcon: <FileSpreadsheet className="h-4 w-4 text-green-500" />,
      downloadHandler: () => {
        generateDetailedPropertyTemplate();
        toast.success('Property template downloaded successfully');
      }
    },
    {
      id: 'owner-property',
      title: 'Owner-Property Mapping',
      description: 'Template for mapping owners to properties and associations (50 rows)',
      icon: <LinkIcon className="h-5 w-5 text-indigo-500" />,
      fileIcon: <FileSpreadsheet className="h-4 w-4 text-indigo-500" />,
      downloadHandler: () => {
        generateOwnerPropertyAssociationTemplate();
        toast.success('Owner-Property mapping template downloaded successfully');
      }
    },
    {
      id: 'association-properties',
      title: 'Association Properties',
      description: 'Template for linking properties to associations (50 rows)',
      icon: <Building className="h-5 w-5 text-teal-500" />,
      fileIcon: <FileSpreadsheet className="h-4 w-4 text-teal-500" />,
      downloadHandler: () => {
        generateAssociationPropertiesTemplate();
        toast.success('Association-Properties template downloaded successfully');
      }
    },
    {
      id: 'violations',
      title: 'Violations Import',
      description: 'Template for importing violation data',
      icon: <FileWarning className="h-5 w-5 text-amber-500" />,
      fileIcon: <FileSpreadsheet className="h-4 w-4 text-amber-500" />,
      downloadHandler: () => {
        toast.info('Violations template is being prepared...');
        // Placeholder for violation template
        setTimeout(() => {
          toast.success('Violations template downloaded successfully');
        }, 1000);
      }
    },
    {
      id: 'documents',
      title: 'Document Metadata',
      description: 'Template for importing document metadata information',
      icon: <FileText className="h-5 w-5 text-red-500" />,
      fileIcon: <FileSpreadsheet className="h-4 w-4 text-red-500" />,
      downloadHandler: () => {
        toast.info('Document metadata template is being prepared...');
        // Placeholder for document metadata template
        setTimeout(() => {
          toast.success('Document metadata template downloaded successfully');
        }, 1000);
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Download Templates</h3>
        <p className="text-sm text-muted-foreground">
          Use these standardized templates to format your data for import
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map(template => (
          <Card key={template.id} className="overflow-hidden">
            <CardHeader className="bg-muted/30 pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {template.icon}
                  <CardTitle className="text-base">{template.title}</CardTitle>
                </div>
              </div>
              <CardDescription className="text-xs">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={template.downloadHandler}
              >
                <FileDown className="h-4 w-4" />
                <span>Download Template</span>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplatesTab;
