
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { documentService } from '@/services/documentService';
import { useAuth } from '@/hooks/use-auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface DocumentUploadButtonProps {
  associationId: string;
  onSuccess?: () => void;
  category?: string;
}

export const DocumentUploadButton: React.FC<DocumentUploadButtonProps> = ({ 
  associationId,
  onSuccess,
  category = 'general'
}) => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Pre-fill name field with file name (without extension)
      const fileName = selectedFile.name.split('.').slice(0, -1).join('.');
      setName(fileName);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    if (!name.trim()) {
      toast.error('Please enter a document name');
      return;
    }

    if (!user?.id) {
      toast.error('You must be logged in to upload documents');
      return;
    }

    setIsUploading(true);

    try {
      const result = await documentService.uploadDocument(
        file,
        associationId,
        user.id,
        {
          name: name.trim(),
          description: description.trim(),
          category
        }
      );

      if (result) {
        setIsDialogOpen(false);
        setFile(null);
        setName('');
        setDescription('');
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Error in document upload:', error);
      toast.error('Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsDialogOpen(true)} 
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        Upload Document
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="document">Select File</Label>
              <Input 
                id="document" 
                type="file" 
                onChange={handleFileChange}
              />
              {file && (
                <p className="text-sm text-muted-foreground">
                  Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>
            
            <div className="grid w-full gap-1.5">
              <Label htmlFor="name">Document Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter document name"
              />
            </div>
            
            <div className="grid w-full gap-1.5">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter document description"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={!file || !name.trim() || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentUploadButton;
