
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FileText, FolderPlus, Upload, Plus, Loader2, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { FileUploader } from '@/components/ui/file-uploader';
import { uploadDocument } from '@/utils/documents/uploadDocument';
import { useAuth } from '@/hooks/use-auth';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createFolder } from '@/utils/documents/folderUtils';
import { ensureDocumentsBucketExists } from '@/utils/documents/bucketUtils';

interface DocumentStructureTabProps {
  onOpenChange: (open: boolean) => void;
}

const DocumentStructureTab: React.FC<DocumentStructureTabProps> = ({ onOpenChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [categories, setCategories] = useState<{id: string, name: string, description?: string}[]>([
    { id: 'financial', name: 'Financial Documents', description: 'Budgets, financial statements, and banking documents' },
    { id: 'legal', name: 'Legal Documents', description: 'Contracts, legal notices, and regulatory documents' },
    { id: 'meetings', name: 'Meeting Minutes', description: 'Records of board and association meetings' }
  ]);
  const [bucketInitialized, setBucketInitialized] = useState(false);
  const [initializingBucket, setInitializingBucket] = useState(false);
  
  const { user } = useAuth();

  useEffect(() => {
    checkBucketExists();
  }, []);

  const checkBucketExists = async () => {
    setInitializingBucket(true);
    const exists = await ensureDocumentsBucketExists();
    setBucketInitialized(exists);
    setInitializingBucket(false);
  };

  const handleInitializeBucket = async () => {
    setInitializingBucket(true);
    try {
      const exists = await ensureDocumentsBucketExists(true);
      setBucketInitialized(exists);
      if (exists) {
        toast.success("Document storage initialized");
      } else {
        toast.error("Failed to initialize document storage");
      }
    } catch (error) {
      console.error("Error initializing storage:", error);
      toast.error("An error occurred initializing document storage");
    } finally {
      setInitializingBucket(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }
    
    if (!user) {
      toast.error("You must be logged in to upload documents");
      return;
    }
    
    if (!bucketInitialized) {
      toast.error("Document storage not initialized. Please initialize it first.");
      return;
    }
    
    setIsUploading(true);
    
    try {
      const result = await uploadDocument({
        file,
        category: 'structure',
        description: 'Document structure definition file',
        tags: ['structure', 'schema'],
        path: `system/structure/${Date.now()}`
      });
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      toast.success("Document structure file uploaded successfully");
      setFile(null);
      
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Error uploading file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }
    
    if (!bucketInitialized) {
      toast.error("Document storage not initialized. Please initialize it first.");
      return;
    }
    
    setIsCreatingCategory(true);
    
    try {
      // Create folder in storage
      const folderId = categoryName.toLowerCase().replace(/\s+/g, '-');
      const success = await createFolder('documents', folderId);
      
      if (!success) {
        throw new Error("Failed to create folder in storage");
      }
      
      // Add to local state
      setCategories([...categories, {
        id: folderId,
        name: categoryName,
        description: categoryDescription
      }]);
      
      // In a real app, we would also store this in the database
      
      toast.success("New document category added");
      setShowCategoryDialog(false);
      setCategoryName('');
      setCategoryDescription('');
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error(error instanceof Error ? error.message : "Error adding category. Please try again.");
    } finally {
      setIsCreatingCategory(false);
    }
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
      
      {!bucketInitialized && (
        <div className="border-2 border-dashed p-4 rounded-lg text-center space-y-4">
          <div className="text-amber-600">
            <svg 
              className="h-12 w-12 mx-auto" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium">Document Storage Not Initialized</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            The document storage system needs to be initialized before you can manage document structure.
          </p>
          <Button 
            onClick={handleInitializeBucket} 
            disabled={initializingBucket}
          >
            {initializingBucket ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : (
              "Initialize Document Storage"
            )}
          </Button>
        </div>
      )}
      
      {bucketInitialized && (
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
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Structure File"
              )}
            </Button>
            
            <div className="text-xs text-muted-foreground">
              <p>Supported formats: JSON, XML, Excel, and CSV</p>
              <p>These files define the structure and organization of your documents</p>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2">
              <FolderPlus className="h-5 w-5 text-green-500" />
              <h3 className="font-medium">Document Categories</h3>
            </div>
            
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {categories.map((category, index) => (
                <li key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <div>
                      <span className="font-medium text-sm">{category.name}</span>
                      {category.description && (
                        <p className="text-xs text-muted-foreground">{category.description}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {index < 3 ? "Default" : "Custom"}
                  </span>
                </li>
              ))}
            </ul>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowCategoryDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </div>
      )}
      
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
              <Input
                id="category-name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="category-description"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                className="h-24"
                placeholder="Enter category description"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowCategoryDialog(false)}
              disabled={isCreatingCategory}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddCategory}
              disabled={isCreatingCategory || !categoryName.trim()}
            >
              {isCreatingCategory ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Add Category"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentStructureTab;
