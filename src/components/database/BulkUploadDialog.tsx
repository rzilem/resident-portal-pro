
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DownloadCloud, FileUp, Upload, X, Check, AlertCircle, Download, FolderIcon, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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

const BulkUploadDialog = ({ open, onOpenChange }: BulkUploadDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setUploadState('idle');
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    // In a real application, we'd send the file to the server here
    setUploadState('uploading');
    
    // Simulate upload process
    setTimeout(() => {
      const isSuccess = true; // In a real app, this would be based on server response
      
      if (isSuccess) {
        setUploadState('success');
        toast({
          title: "Upload successful",
          description: `Successfully processed ${selectedFile.name}`,
        });
      } else {
        setUploadState('error');
        toast({
          title: "Upload failed",
          description: "There was an error processing your file. Please check the format and try again.",
          variant: "destructive"
        });
      }
    }, 2000);
  };

  const handleDownloadTemplate = (type: string) => {
    // In a real application, we'd generate and download the template
    toast({
      title: "Template downloaded",
      description: `${type} template has been downloaded to your device`,
    });
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadState('idle');
    setSelectedCategories([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Bulk Import Association Data</DialogTitle>
          <DialogDescription>
            Upload a spreadsheet with all homeowner data for an entire association at once.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="upload" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
            <TabsTrigger value="documents">Upload Documents</TabsTrigger>
            <TabsTrigger value="templates">Download Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4 py-4">
            {uploadState === 'success' ? (
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-6 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium text-lg">Upload Complete!</h3>
                  <p className="text-muted-foreground mt-1">
                    Your association data has been successfully imported.
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={resetUpload}>
                    Upload Another
                  </Button>
                  <Button onClick={() => onOpenChange(false)}>
                    Done
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-4">
                  <Label htmlFor="file-upload">Select Association Spreadsheet</Label>
                  
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      {selectedFile ? (
                        <div className="flex flex-col items-center">
                          <FileUp className="h-8 w-8 text-primary mb-2" />
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <DownloadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="font-medium">Click to upload or drag and drop</p>
                          <p className="text-sm text-muted-foreground">
                            Supports Excel files (.xlsx, .xls) and CSV
                          </p>
                        </div>
                      )}
                    </Label>
                  </div>
                </div>

                {selectedFile && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Make sure your file follows the required format. <a href="#" className="underline" onClick={(e) => {
                        e.preventDefault();
                        handleDownloadTemplate('Association');
                      }}>Download template</a> if you're unsure.
                    </AlertDescription>
                  </Alert>
                )}

                <DialogFooter className="flex justify-between">
                  {selectedFile && (
                    <Button 
                      variant="outline" 
                      className="gap-2"
                      onClick={resetUpload}
                    >
                      <X className="h-4 w-4" />
                      Clear
                    </Button>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                      Cancel
                    </Button>
                    <Button 
                      disabled={!selectedFile || uploadState === 'uploading'} 
                      onClick={handleUpload}
                      className="gap-2"
                    >
                      {uploadState === 'uploading' ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Upload Data
                        </>
                      )}
                    </Button>
                  </div>
                </DialogFooter>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-6 py-4">
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
                onClick={() => {
                  setSelectedCategories(DOCUMENT_CATEGORIES.map(c => c.id));
                }}
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
                  onClick={() => {
                    toast({
                      title: "Document structure created",
                      description: `Created ${selectedCategories.length} document folders for your association`,
                    });
                    setUploadState('success');
                  }}
                >
                  <Upload className="h-4 w-4" />
                  Create Document Structure
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-6 py-4">
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadDialog;
