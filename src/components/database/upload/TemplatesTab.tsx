
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TemplatesTabProps {
  onOpenChange: (open: boolean) => void;
}

const TemplatesTab = ({ onOpenChange }: TemplatesTabProps) => {
  const { toast } = useToast();

  const handleDownloadTemplate = (type: string) => {
    // In a real implementation, you would generate and download the template
    toast({
      title: "Template downloaded",
      description: `${type} template has been downloaded to your device`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground mb-4">
        Download template files to ensure your data is in the correct format for import.
      </div>
      
      <div className="space-y-4">
        <div className="border rounded-md p-4 flex justify-between items-center">
          <div>
            <h3 className="font-medium">Association with Homeowners</h3>
            <p className="text-sm text-muted-foreground">Complete template with all homeowner data</p>
          </div>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => handleDownloadTemplate('Association')}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
        
        <div className="border rounded-md p-4 flex justify-between items-center">
          <div>
            <h3 className="font-medium">Homeowners Only</h3>
            <p className="text-sm text-muted-foreground">Template for importing only homeowner data</p>
          </div>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => handleDownloadTemplate('Homeowners')}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
        
        <div className="border rounded-md p-4 flex justify-between items-center">
          <div>
            <h3 className="font-medium">Properties and Units</h3>
            <p className="text-sm text-muted-foreground">Template for importing property and unit data</p>
          </div>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => handleDownloadTemplate('Properties')}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>

        <div className="border rounded-md p-4 flex justify-between items-center">
          <div>
            <h3 className="font-medium">Document Categories Structure</h3>
            <p className="text-sm text-muted-foreground">Template showing all available document folders</p>
          </div>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => handleDownloadTemplate('Document Categories')}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplatesTab;
