import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, FileUp, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { uploadDocument } from '@/services/document-upload';
import { useAssociations } from '@/hooks/use-associations';
import { useAuth } from '@/hooks/use-auth';
import { useDocumentsBucket } from '@/hooks/use-documents-bucket';
import { supabase } from '@/integrations/supabase/client';
import { ensureDocumentsBucketExists } from '@/utils/documents/bucketUtils';

interface DocumentUploadDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
  refreshDocuments?: () => void;
  categoryId?: string;
  associationId?: string;
}

const formSchema = z.object({
  file: z.instanceof(File, { message: "Please select a file" }),
  name: z.string().min(1, "File name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  tags: z.string().optional(),
});

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  open, 
  setOpen,
  onSuccess,
  refreshDocuments,
  categoryId,
  associationId
}) => {
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { activeAssociation } = useAssociations();
  const { user } = useAuth();
  const { bucketReady, demoMode } = useDocumentsBucket();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: categoryId || "",
      tags: "",
    },
  });
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('document_categories')
          .select('id, name')
          .order('name');
        
        if (error) {
          console.error('Error fetching document categories:', error);
          toast.error('Failed to load document categories');
          return;
        }
        
        setCategories(data || []);
        
        if (categoryId) {
          form.setValue('category', categoryId);
        }
      } catch (error) {
        console.error('Error in fetchCategories:', error);
        toast.error('Failed to load categories');
      }
    };
    
    fetchCategories();
    
    if (open) {
      setUploadError(null);
    }
  }, [categoryId, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      form.setValue('file', file);
      
      if (!form.getValues('name')) {
        const fileName = file.name.split('.').slice(0, -1).join('.');
        form.setValue('name', fileName);
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error("You must be logged in to upload documents");
      return;
    }
    
    const targetAssociationId = associationId || (activeAssociation ? activeAssociation.id : null);
    
    if (!targetAssociationId) {
      toast.error("Please select an association");
      return;
    }
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const bucketReady = await ensureDocumentsBucketExists();
      if (!bucketReady && !demoMode) {
        setUploadError("Document storage is not available. Please try again later.");
        setIsUploading(false);
        return;
      }
      
      const tagArray = values.tags 
        ? values.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [];
      
      const result = await uploadDocument({
        file: values.file,
        description: values.description || '',
        category: values.category,
        tags: tagArray,
        associationId: targetAssociationId
      });
      
      if (result) {
        toast.success("Document uploaded successfully");
        setOpen(false);
        form.reset();
        
        if (onSuccess) {
          onSuccess();
        }
        
        if (refreshDocuments) {
          refreshDocuments();
        }
      } else {
        setUploadError("Failed to upload document. Please try again.");
      }
    } catch (error) {
      console.error('Document upload error:', error);
      setUploadError(error instanceof Error ? error.message : "Error uploading document");
      toast.error("Error uploading document");
    } finally {
      setIsUploading(false);
    }
  };

  const renderDemoWarning = () => {
    if (demoMode) {
      return (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4 rounded">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-amber-800">Demo Mode</h3>
              <p className="text-sm text-amber-700 mt-1">
                Document upload will be simulated but not stored permanently.
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileUp className="h-5 w-5" />
            Upload Document
          </DialogTitle>
        </DialogHeader>
        
        {renderDemoWarning()}
        
        {uploadError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Upload Error</h3>
                <p className="text-sm text-red-700 mt-1">{uploadError}</p>
              </div>
            </div>
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      onChange={handleFileChange}
                      disabled={isUploading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter document name" {...field} disabled={isUploading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter a description (optional)"
                      className="resize-none" 
                      {...field}
                      disabled={isUploading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isUploading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma-separated)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. important, financial, meeting"
                      {...field}
                      disabled={isUploading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isUploading || (!bucketReady && !demoMode)}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FileUp className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
