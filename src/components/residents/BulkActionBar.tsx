
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Mail, Download, Tag, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface BulkActionBarProps {
  selectedResidents: number[];
  handleBulkEmail: () => void;
  handleBulkExport: () => void;
  handleBulkTag: () => void;
  handleBulkDelete: () => void;
}

const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedResidents,
  handleBulkEmail,
  handleBulkExport,
  handleBulkTag,
  handleBulkDelete,
}) => {
  if (selectedResidents.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <Alert className="bg-muted/50 border border-muted">
        <AlertDescription className="flex items-center justify-between">
          <span><strong>{selectedResidents.length}</strong> resident{selectedResidents.length !== 1 ? 's' : ''} selected</span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBulkEmail}
              className="h-8"
            >
              <Mail className="h-3.5 w-3.5 mr-1" />
              Email
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBulkExport}
              className="h-8"
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBulkTag}
              className="h-8"
            >
              <Tag className="h-3.5 w-3.5 mr-1" />
              Tag
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBulkDelete}
              className="h-8 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Delete
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default BulkActionBar;
