
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, RefreshCw } from "lucide-react";

interface DocumentTableEmptyStateProps {
  searchQuery: string;
  localSearchQuery: string;
  associationId?: string;
  refreshDocuments: () => void;
}

const DocumentTableEmptyState: React.FC<DocumentTableEmptyStateProps> = ({
  searchQuery,
  localSearchQuery,
  associationId,
  refreshDocuments
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10">
      <FileText className="h-10 w-10 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No documents found</h3>
      <p className="text-muted-foreground mt-1">
        {searchQuery || localSearchQuery
          ? `No results for "${searchQuery || localSearchQuery}"`
          : associationId
            ? 'No documents available for this association'
            : 'No documents match the current filters'}
      </p>
      <Button variant="outline" className="mt-4" onClick={refreshDocuments}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh Documents
      </Button>
    </div>
  );
};

export default DocumentTableEmptyState;
