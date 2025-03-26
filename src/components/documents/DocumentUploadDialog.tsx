
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileUp, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAssociations } from '@/hooks/use-associations';
import { v4 as uuidv4 } from 'uuid';
import { useAuthRole } from '@/hooks/use-auth-role';
import FileUploader from './FileUploader';

interface DocumentUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  refreshDocuments?: () => void;
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  refreshDocuments
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { activeAssociation } = useAssociations();
  const { role } = useAuthRole();
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('uncategorized');
  const [tags, setTags] = useState<string[]>([]);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!activeAssociation) {
      toast.error('Please select an association first');
      return;
    }

    setIsUploading(true);
    
    try {
      // Create a unique file name using uuid
      const fileExtension = selectedFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const filePath = `${activeAssociation.id}/${fileName}`;

      // Upload file to storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('documents')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (storageError) {
        console.error('Upload error:', storageError);
        toast.error(`Failed to upload document: ${storageError.message}`);
        return;
      }

      console.log('Document uploaded successfully to storage:', storageData);
      
      // Get user ID for document ownership
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('User authentication required for uploading documents');
        return;
      }
      
      // Save document metadata to the documents table
      const { data: documentData, error: documentError } = await supabase
        .from('documents')
        .insert({
          name: selectedFile.name,
          description: description,
          file_size: selectedFile.size,
          file_type: selectedFile.type,
          url: filePath,
          category: category,
          tags: tags.length > 0 ? tags : null,
          uploaded_by: user.id,
          association_id: activeAssociation.id,
          is_public: false,
          version: 1
        })
        .select()
        .single();

      if (documentError) {
        console.error('Error saving document metadata:', documentError);
        toast.error(`Document uploaded but metadata couldn't be saved: ${documentError.message}`);
        return;
      }

      console.log('Document metadata saved:', documentData);
      
      toast.success(`Document "${selectedFile.name}" uploaded successfully`);
      onSuccess();
      if (refreshDocuments) refreshDocuments();
      onClose();
      
      // Reset form
      setSelectedFile(null);
      setDescription('');
      setCategory('uncategorized');
      setTags([]);
    } catch (error) {
      console.error('Unexpected upload error:', error);
      toast.error('An unexpected error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };
  
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagList = e.target.value.split(',').map(tag => tag.trim());
    setTags(tagList.filter(tag => tag !== ''));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a document to share with your association
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <FileUploader 
            onFileSelected={handleFileChange}
            currentFile={selectedFile}
          />
          
          {selectedFile && (
            <div className="space-y-3">
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description (optional)
                </label>
                <input
                  id="description"
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter document description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  id="category"
                  className="w-full p-2 border rounded-md"
                  value={category}
                  onChange={handleCategoryChange}
                >
                  <option value="uncategorized">Uncategorized</option>
                  <option value="financial">Financial</option>
                  <option value="legal">Legal</option>
                  <option value="meetings">Meeting Minutes</option>
                  <option value="rules">Rules & Regulations</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="tags" className="block text-sm font-medium mb-1">
                  Tags (comma separated)
                </label>
                <input
                  id="tags"
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="important, board, budget"
                  onChange={handleTagChange}
                />
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
            {isUploading ? (
              <>
                <span className="mr-2">Uploading...</span>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
