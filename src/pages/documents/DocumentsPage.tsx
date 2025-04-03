
import React, { useState } from 'react';
import DocumentManager from '@/components/documents/DocumentManager';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useDocumentsBucket } from '@/hooks/use-documents-bucket';
import { FolderIcon, SettingsIcon, RefreshCwIcon, AlertTriangleIcon } from 'lucide-react';

const DocumentsPage = () => {
  // This hook checks if the document storage is ready (e.g., Supabase bucket exists)
  const { bucketReady, checking, error, retryCheck } = useDocumentsBucket();
  const [selectedAssociationId, setSelectedAssociationId] = useState<string | undefined>(undefined);

  // For a production app, you'd fetch associations the user has access to
  // and let them switch between them
  
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            Manage and organize your association documents
          </p>
        </div>
        
        <Button variant="outline">
          <SettingsIcon className="h-4 w-4 mr-2" />
          Document Settings
        </Button>
      </div>
      
      {error && (
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-800 flex items-center gap-2">
              <AlertTriangleIcon className="h-5 w-5" />
              Document Storage Issue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-amber-700">
              {error}
            </CardDescription>
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={retryCheck}
                disabled={checking}
                className="border-amber-500 text-amber-700 hover:bg-amber-100"
              >
                {checking ? (
                  <>
                    <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <RefreshCwIcon className="h-4 w-4 mr-2" />
                    Retry
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {bucketReady && (
        <DocumentManager associationId={selectedAssociationId} />
      )}
      
      {checking && !error && !bucketReady && (
        <Card>
          <CardContent className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center">
              <RefreshCwIcon className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Checking document storage...</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentsPage;
