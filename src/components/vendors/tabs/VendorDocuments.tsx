
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVendorDocuments, uploadVendorDocument, deleteVendorDocument } from '@/api/vendorApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Download, Trash2, AlertCircle, File } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface VendorDocumentsProps {
  vendorId: string;
}

const VendorDocuments: React.FC<VendorDocumentsProps> = ({ vendorId }) => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('general');
  const [documentToDelete, setDocumentToDelete] = useState<{ id: string; name: string; url: string } | null>(null);
  
  const queryClient = useQueryClient();
  
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['vendorDocuments', vendorId],
    queryFn: () => getVendorDocuments(vendorId),
  });
  
  const uploadMutation = useMutation({
    mutationFn: () => {
      if (!selectedFile) return Promise.reject('No file selected');
      return uploadVendorDocument(vendorId, selectedFile, documentType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorDocuments', vendorId] });
      setIsUploadDialogOpen(false);
      setSelectedFile(null);
      setDocumentType('general');
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: ({ id, url }: { id: string; url: string }) => deleteVendorDocument(id, url),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorDocuments', vendorId] });
      setIsDeleteDialogOpen(false);
      setDocumentToDelete(null);
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleUpload = () => {
    if (!selectedFile) return;
    uploadMutation.mutate();
  };
  
  const handleDeleteClick = (document: any) => {
    setDocumentToDelete(document);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDelete = () => {
    if (!documentToDelete) return;
    deleteMutation.mutate({ id: documentToDelete.id, url: documentToDelete.url });
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-9 w-36" />
          </div>
          <Skeleton className="h-4 w-48 mt-1" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const getDocumentIcon = (name: string) => {
    const extension = name.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <File className="h-5 w-5 text-blue-500" />;
    } else if (['pdf'].includes(extension || '')) {
      return <File className="h-5 w-5 text-red-500" />;
    } else if (['doc', 'docx'].includes(extension || '')) {
      return <File className="h-5 w-5 text-blue-700" />;
    } else if (['xls', 'xlsx'].includes(extension || '')) {
      return <File className="h-5 w-5 text-green-600" />;
    } else {
      return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Documents</CardTitle>
          <Button onClick={() => setIsUploadDialogOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Upload Document
          </Button>
        </div>
        <CardDescription>Manage vendor documents and files</CardDescription>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No documents uploaded yet</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={() => setIsUploadDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> Upload Document
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc: any) => (
              <div 
                key={doc.id} 
                className="flex items-center justify-between p-3 bg-muted/40 rounded-md hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getDocumentIcon(doc.name)}
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.document_type} • Uploaded {format(new Date(doc.upload_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    asChild
                  >
                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteClick(doc)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="file">Select File</Label>
              <Input 
                id="file" 
                type="file" 
                onChange={handleFileChange}
              />
            </div>
            
            <div>
              <Label htmlFor="documentType">Document Type</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger id="documentType">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="invoice">Invoice</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedFile && (
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertTitle>Selected File</AlertTitle>
                <AlertDescription>
                  {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsUploadDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleUpload} 
              disabled={!selectedFile || uploadMutation.isPending}
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Delete Document
            </DialogTitle>
          </DialogHeader>
          
          <p>Are you sure you want to delete "{documentToDelete?.name}"?</p>
          <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default VendorDocuments;
