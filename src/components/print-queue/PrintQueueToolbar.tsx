
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Printer, Send, Download, FileText } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { PDFGeneratorCore } from '@/utils/pdf/PDFGeneratorCore';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface PrintQueueToolbarProps {
  selectedJobs: string[];
  onPrint: () => void;
  onSendToHOAMailers: () => void;
  onIncludeMailingLabelsChange: (checked: boolean) => void;
  onPrintPreviewChange: (checked: boolean) => void;
  includeMailingLabels: boolean;
  printPreview: boolean;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const PrintQueueToolbar: React.FC<PrintQueueToolbarProps> = ({
  selectedJobs,
  onPrint,
  onSendToHOAMailers,
  onIncludeMailingLabelsChange,
  onPrintPreviewChange,
  includeMailingLabels,
  printPreview,
  activeTab,
  onTabChange
}) => {
  const { toast } = useToast();
  
  const handleExport = () => {
    if (selectedJobs.length === 0) {
      toast({
        title: "No jobs selected",
        description: "Please select at least one job to export.",
        variant: "destructive"
      });
      return;
    }
    
    // Create simple PDF export with job information
    const pdf = new PDFGeneratorCore({
      title: 'Print Queue Export',
      filename: 'print-queue-export.pdf',
    });
    
    pdf.addTitle('Print Queue Export')
      .addSubtitle(`Generated on ${new Date().toLocaleDateString()}`)
      .addLineBreak()
      .addText(`Total Jobs Selected: ${selectedJobs.length}`)
      .addLineBreak()
      .addHorizontalLine()
      .save();
      
    toast({
      title: "Export complete",
      description: `${selectedJobs.length} jobs have been exported to PDF.`,
    });
  };
  
  const handlePrint = () => {
    if (selectedJobs.length === 0) {
      toast({
        title: "No jobs selected",
        description: "Please select at least one job to print.",
        variant: "destructive"
      });
      return;
    }
    
    onPrint();
    
    toast({
      title: "Print job started",
      description: `${selectedJobs.length} documents have been sent to the printer.`,
    });
  };
  
  const handleSendToHOAMailers = () => {
    if (selectedJobs.length === 0) {
      toast({
        title: "No jobs selected",
        description: "Please select at least one job to send.",
        variant: "destructive"
      });
      return;
    }
    
    onSendToHOAMailers();
    
    toast({
      title: "HOA Mailers feature",
      description: "This feature requires API integration which is not yet available.",
    });
  };
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList>
          <TabsTrigger value="queue">Queue</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="third-party-orders">Third Party Orders</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex flex-wrap items-center gap-4 p-4 border rounded-md bg-background">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="include-mailing-labels" 
            checked={includeMailingLabels}
            onCheckedChange={(checked) => onIncludeMailingLabelsChange(!!checked)}
          />
          <label 
            htmlFor="include-mailing-labels"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Include Mailing Labels
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="print-preview" 
            checked={printPreview}
            onCheckedChange={(checked) => onPrintPreviewChange(!!checked)}
          />
          <label 
            htmlFor="print-preview"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Print Preview
          </label>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePrint}
                disabled={selectedJobs.length === 0}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Print selected jobs</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSendToHOAMailers}
                disabled={selectedJobs.length === 0}
              >
                <Send className="h-4 w-4 mr-2" />
                Send to HOA Mailers
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Send selected jobs to HOA mailing service</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExport}
                disabled={selectedJobs.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export selected jobs to PDF</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default PrintQueueToolbar;
