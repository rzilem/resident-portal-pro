
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import FileUploader from "@/components/documents/FileUploader";
import { DocumentAccessLevel } from '@/types/documents';
import { getDocumentCategories } from "@/utils/documents/documentUtils";
import { toast } from "sonner";
import { useAuthRole } from '@/hooks/use-auth-role';

interface DocumentUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [accessLevel, setAccessLevel] = useState<DocumentAccessLevel>('all');
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [uploading, setUploading] = useState(false);
  const { role, isAdmin, isManager } = useAuthRole();
  
  // Load categories when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      const loadCategories = async () => {
        try {
          const cats = await getDocumentCategories(role);
          setCategories(cats.map(cat => ({ id: cat.id, name: cat.name })));
          if (cats.length > 0) {
            setCategory(cats[0].id);
          }
        } catch (error) {
          console.error('Failed to load categories:', error);
          toast.error('Failed to load document categories');
        }
      };
      
      loadCategories();
    }
  }, [isOpen, role]);
  
  // Update filename when file is selected
  React.useEffect(() => {
    if (file) {
      setFileName(file.name);
    }
  }, [file]);
  
  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    if (!fileName.trim()) {
      toast.error('Please enter a file name');
      return;
    }
    
    if (!category) {
      toast.error('Please select a document category');
      return;
    }
    
    setUploading(true);
    
    try {
      // Mock document upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Document uploaded successfully');
      
      // Reset form fields
      setFile(null);
      setFileName('');
      setDescription('');
      setCategory('');
      setAccessLevel('all');
      
      // Close dialog
      onClose();
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  
  // Check if user can set access levels
  const canSetAccessLevel = isAdmin || isManager;
  
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a document to the association library.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <FileUploader 
            onFileSelected={setFile}
            currentFile={file}
          />
          
          <div className="grid grid-cols-1 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fileName">Document Name</Label>
              <Input
                id="fileName"
                value={fileName}
                onChange={e => setFileName(e.target.value)}
                placeholder="Enter document name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Enter document description"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {canSetAccessLevel && (
              <div className="grid gap-2">
                <Label htmlFor="accessLevel">Access Level</Label>
                <Select value={accessLevel} onValueChange={setAccessLevel as any}>
                  <SelectTrigger id="accessLevel">
                    <SelectValue placeholder="Select access level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users (Public)</SelectItem>
                    <SelectItem value="homeowner">Homeowners & Above</SelectItem>
                    <SelectItem value="board">Board Members & Above</SelectItem>
                    <SelectItem value="management">Management Staff Only</SelectItem>
                    {isAdmin && <SelectItem value="admin">Administrators Only</SelectItem>}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  This determines who can access this document in the system.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleUpload}
            disabled={uploading || !file || !fileName.trim() || !category}
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
