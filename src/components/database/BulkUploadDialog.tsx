
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DownloadCloud, FileUp, Upload, X, Check, AlertCircle, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BulkUploadDialog = ({ open, onOpenChange }: BulkUploadDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setUploadState('idle');
    }
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

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
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
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadDialog;
