
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FileText, FolderPlus, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { FileUploader } from '@/components/ui/file-uploader';
import { uploadFile } from '@/utils/supabase/storage/uploadFile';
import { useAuth } from '@/hooks/use-auth';

interface DocumentStructureTabProps {
  onOpenChange: (open: boolean) => void;
}

const DocumentStructureTab: React.FC<DocumentStructureTabProps> = ({ onOpenChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const { user } = useAuth();

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }
    
    if (!user) {
      toast.error("You must be logged in to upload documents");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Upload file to storage
      const uploadPath = `documents/structure/${Date.now()}-${file.name}`;
      const url = await uploadFile(file, 'documents', uploadPath);
      
      if (!url) {
        throw new Error("Failed to upload document structure file");
      }
      
      toast.success("Document structure file uploaded successfully");
      setFile(null);
      
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddCategory = () => {
    // In a real app, this would add a new document category
    toast.success("New document category added");
    setShowCategoryDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/40 rounded-lg p-4 text-sm">
        <h4 className="font-medium mb-2">Document Structure Management</h4>
        <p>
          Upload document structure files or add document categories to organize your association's files.
          Document structures help maintain consistency in your filing system.
        </p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium">Upload Structure File</h3>
          </div>
          
          <FileUploader
            file={file}
            setFile={setFile}
            disabled={isUploading}
            acceptedTypes=".json,.xml,.xlsx,.csv"
            maxSize={5 * 1024 * 1024} // 5MB max size
          />
          
          <Button 
            className="w-full" 
            onClick={handleUpload} 
            disabled={!file || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload Structure File"}
          </Button>
        </div>
        
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-green-500" />
            <h3 className="font-medium">Document Categories</h3>
          </div>
          
          <ul className="space-y-2">
            <li className="flex justify-between items-center p-2 bg-muted/50 rounded">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span>Financial Documents</span>
              </div>
              <span className="text-xs text-muted-foreground">Default</span>
            </li>
            <li className="flex justify-between items-center p-2 bg-muted/50 rounded">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-500" />
                <span>Legal Documents</span>
              </div>
              <span className="text-xs text-muted-foreground">Default</span>
            </li>
            <li className="flex justify-between items-center p-2 bg-muted/50 rounded">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-500" />
                <span>Meeting Minutes</span>
              </div>
              <span className="text-xs text-muted-foreground">Default</span>
            </li>
          </ul>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowCategoryDialog(true)}
          >
            Add Category
          </Button>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button onClick={() => onOpenChange(false)}>Close</Button>
      </div>
      
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent>
          <DialogTitle>Add Document Category</DialogTitle>
          <DialogDescription>
            Create a new document category for organizing files
          </DialogDescription>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="category-name" className="text-sm font-medium">
                Category Name
              </label>
              <input
                id="category-name"
                className="w-full p-2 border rounded"
                placeholder="Enter category name"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category-description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="category-description"
                className="w-full p-2 border rounded h-24"
                placeholder="Enter category description"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>
              Add Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentStructureTab;
