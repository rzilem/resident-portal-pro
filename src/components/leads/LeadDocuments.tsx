import React from 'react';
import { LeadDocument } from './types';
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, X, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface LeadDocumentsProps {
  documents: LeadDocument[];
  leadId: string;
  canDelete?: boolean;
  onDocumentsChange?: (documents: LeadDocument[]) => void;
}

const LeadDocuments: React.FC<LeadDocumentsProps> = ({ 
  documents = [], 
  leadId,
  canDelete = false,
  onDocumentsChange
}) => {
  if (!documents || documents.length === 0) {
    return <div className="text-sm text-muted-foreground">No documents attached</div>;
  }

  const handleDownload = async (doc: LeadDocument) => {
    try {
      console.log('Downloading document:', doc);
      
      // If it's a full URL, use it directly
      if (doc.url && (doc.url.startsWith('http://') || doc.url.startsWith('https://'))) {
        const link = document.createElement('a');
        link.href = doc.url;
        link.download = doc.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
      
      // Otherwise, get from Supabase storage
      if (doc.path) {
        console.log('Downloading from path:', doc.path);
        const { data, error } = await supabase.storage
          .from('documents')
          .download(doc.path);
          
        if (error) {
          console.error('Error downloading document:', error);
          throw error;
        }
        
        if (data) {
          const url = URL.createObjectURL(data);
          const link = document.createElement('a');
          link.href = url;
          link.download = doc.name;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Failed to download document");
    }
  };

  const handlePreview = async (doc: LeadDocument) => {
    try {
      console.log('Previewing document:', doc);
      
      // If it's a full URL, use it directly
      if (doc.url && (doc.url.startsWith('http://') || doc.url.startsWith('https://'))) {
        window.open(doc.url, '_blank');
        return;
      }
      
      // Otherwise, get a signed URL from Supabase storage
      if (doc.path) {
        console.log('Getting signed URL for path:', doc.path);
        const { data, error } = await supabase.storage
          .from('documents')
          .createSignedUrl(doc.path, 60); // 60 seconds expiry
          
        if (error) {
          console.error('Error creating signed URL:', error);
          throw error;
        }
        
        if (data && data.signedUrl) {
          window.open(data.signedUrl, '_blank');
        }
      }
    } catch (error) {
      console.error("Error previewing document:", error);
      toast.error("Failed to preview document");
    }
  };

  const handleDelete = async (doc: LeadDocument, index: number) => {
    if (!onDocumentsChange) return;
    
    try {
      console.log('Deleting document:', doc, 'at index:', index);
      
      if (doc.path) {
        console.log('Deleting from storage path:', doc.path);
        const { error } = await supabase.storage
          .from('documents')
          .remove([doc.path]);

        if (error) {
          console.warn('Error removing from storage:', error);
          // Continue with deletion from the lead record even if storage delete fails
        }
      }

      const updatedDocuments = [...documents];
      updatedDocuments.splice(index, 1);
      
      console.log('Updating lead record with remaining documents:', updatedDocuments);
      const { error: updateError } = await supabase
        .from('leads')
        .update({
          uploaded_files: updatedDocuments.length > 0 ? updatedDocuments : null,
          updatedat: new Date().toISOString()
        })
        .eq('id', leadId);
        
      if (updateError) {
        console.error('Error updating lead record:', updateError);
        throw updateError;
      }
      
      onDocumentsChange(updatedDocuments);
      toast.success("Document deleted successfully");
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    }
  };

  return (
    <div className="space-y-2">
      {documents.map((doc, index) => (
        <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded text-sm">
          <div className="flex items-center gap-2 overflow-hidden">
            <FileText className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{doc.name}</span>
            <span className="text-xs text-muted-foreground">
              ({doc.size ? Math.round(doc.size / 1024) : 'Unknown'} KB)
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => handlePreview(doc)}
              title="Preview"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => handleDownload(doc)}
              title="Download"
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
            {canDelete && onDocumentsChange && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-destructive"
                onClick={() => handleDelete(doc, index)}
                title="Delete"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeadDocuments;
