
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, FileText, FileUp } from 'lucide-react';
import { toast } from 'sonner';
import { generateOnboardingTemplate } from '@/utils/exportToExcel';

interface TemplatesTabProps {
  onOpenChange: (open: boolean) => void;
}

const TemplatesTab: React.FC<TemplatesTabProps> = ({ onOpenChange }) => {
  // Template categories with descriptions
  const templates = [
    {
      name: "Association Onboarding Template",
      description: "A comprehensive template for onboarding new associations with sample data.",
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      action: generateOnboardingTemplate
    },
    {
      name: "Resident Import Template",
      description: "Template for importing resident data into the system.",
      icon: <FileText className="h-5 w-5 text-green-500" />,
      action: () => {
        // In a real app, this would generate a specific template
        toast.success("Resident Import Template downloaded");
      }
    },
    {
      name: "Financial Records Template",
      description: "Template for importing financial records and transactions.",
      icon: <FileText className="h-5 w-5 text-amber-500" />,
      action: () => {
        // In a real app, this would generate a specific template
        toast.success("Financial Records Template downloaded");
      }
    },
    {
      name: "Property Details Template",
      description: "Template for importing property details and unit information.",
      icon: <FileText className="h-5 w-5 text-purple-500" />,
      action: () => {
        // In a real app, this would generate a specific template
        toast.success("Property Details Template downloaded");
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
        {templates.map((template, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
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
            >
              <FileDown className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button onClick={() => onOpenChange(false)}>Close</Button>
      </div>
    </div>
  );
};

export default TemplatesTab;
