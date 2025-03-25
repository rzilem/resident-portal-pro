
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Printer, Send, FileDown } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onPrint}
          disabled={selectedJobs.length === 0}
        >
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onSendToHOAMailers}
          disabled={selectedJobs.length === 0}
        >
          <Send className="h-4 w-4 mr-2" />
          Send to HOA Mailers
        </Button>
        
        <Button variant="outline" size="sm">
          <FileDown className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};

export default PrintQueueToolbar;
