
import React from 'react';
import { LeadDocument } from './types';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, X } from 'lucide-react';
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

  const handleDownload = (doc: LeadDocument) => {
    try {
      const link = document.createElement('a');
      link.href = doc.url;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Failed to download document");
    }
  };

  const handlePreview = (doc: LeadDocument) => {
    window.open(doc.url, '_blank');
  };

  const handleDelete = async (doc: LeadDocument, index: number) => {
    if (!onDocumentsChange) return;
    
    try {
      const { error } = await supabase.storage
        .from('documents')
        .remove([doc.path]);

      if (error) throw error;

      const updatedDocuments = [...documents];
      updatedDocuments.splice(index, 1);
      
      const { error: updateError } = await supabase
        .from('leads')
        .update({
          uploaded_files: updatedDocuments.length > 0 ? updatedDocuments : null,
          updatedat: new Date().toISOString()
        })
        .eq('id', leadId);
        
      if (updateError) throw updateError;
      
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
              ({Math.round(doc.size / 1024)} KB)
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
