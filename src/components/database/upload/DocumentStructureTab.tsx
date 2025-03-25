
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FolderIcon, AlertCircle, CheckCircle2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentStructureTabProps {
  onOpenChange: (open: boolean) => void;
}

// Document categories constant
const DOCUMENT_CATEGORIES = [
  { id: 'bankStatements', name: 'Bank Statements' },
  { id: 'communityDocuments', name: 'Community Documents' },
  { id: 'communityMeetings', name: 'Community Meetings' },
  { id: 'financials', name: 'Financials' },
  { id: 'forms', name: 'Forms' },
  { id: 'invoiceImages', name: 'Invoice Images' },
  { id: 'leases', name: 'Leases' },
  { id: 'maintenance', name: 'Maintenance' },
  { id: 'monthlyFinancialReports', name: 'Monthly Financial Reports' },
  { id: 'violations', name: 'Violations' },
];

const DocumentStructureTab = ({ onOpenChange }: DocumentStructureTabProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { toast } = useToast();

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCreateStructure = () => {
    toast({
      title: "Document structure created",
      description: `Created ${selectedCategories.length} document folders for your association`,
    });
    // In a real implementation, you would create the folders on the server
    onOpenChange(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground mb-4">
        Select document categories to include in your association setup:
      </div>
      
      <div className="space-y-4 max-h-[300px] overflow-y-auto border rounded-md p-4">
        {DOCUMENT_CATEGORIES.map((category) => (
          <div key={category.id} className="flex items-center space-x-2 py-2 border-b last:border-0">
            <Checkbox 
              id={category.id} 
              checked={selectedCategories.includes(category.id)}
              onCheckedChange={() => handleCategoryToggle(category.id)}
            />
            <Label htmlFor={category.id} className="flex-1 flex items-center cursor-pointer">
              <FolderIcon className="h-5 w-5 text-yellow-400 mr-2" />
              <span>{category.name}</span>
            </Label>
            <span className="text-sm text-muted-foreground">File folder</span>
          </div>
        ))}
      </div>

      <div className="bg-muted rounded-md p-4">
        <div className="text-sm flex items-start gap-3">
          <div className="text-muted-foreground mt-0.5">
            <AlertCircle className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium mb-1">Document Uploads</p>
            <p className="text-muted-foreground">
              After completing the initial setup, you'll be able to upload documents to the selected 
              categories. The folder structure will be created automatically.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t pt-4 flex justify-between">
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => setSelectedCategories(DOCUMENT_CATEGORIES.map(c => c.id))}
        >
          <CheckCircle2 className="h-4 w-4" />
          Select All
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            disabled={selectedCategories.length === 0} 
            className="gap-2"
            onClick={handleCreateStructure}
          >
            <Upload className="h-4 w-4" />
            Create Document Structure
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentStructureTab;
