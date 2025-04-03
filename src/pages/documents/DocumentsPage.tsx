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
import { FolderIcon, SettingsIcon, RefreshCwIcon, AlertTriangleIcon, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DocumentUploader from '@/components/documents/DocumentUploader';
import { toast } from 'sonner';
import { useAssociations } from '@/hooks/use-associations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DocumentsPage = () => {
  // This hook checks if the document storage is ready (e.g., Supabase bucket exists)
  const { bucketReady, checking, error, retryCheck } = useDocumentsBucket();
  const [selectedAssociationId, setSelectedAssociationId] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string>('documents');
  const [showUploader, setShowUploader] = useState(false);
  
  // Fetch associations the user has access to
  const { associations, loading: loadingAssociations } = useAssociations();
  
  const handleUploadComplete = () => {
    toast.success('Document uploaded successfully');
    setShowUploader(false);
  };
  
  const handleAssociationChange = (id: string) => {
    setSelectedAssociationId(id);
    toast.info(`Switched to ${associations.find(a => a.id === id)?.name || 'association'} documents`);
  };
  
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            Manage and organize your association documents
          </p>
        </div>
        
        <div className="flex gap-2">
          {bucketReady && (
            <Button 
              variant={showUploader ? "secondary" : "outline"}
              onClick={() => setShowUploader(!showUploader)}
            >
              <Upload className="h-4 w-4 mr-2" />
              {showUploader ? "Cancel Upload" : "Upload Document"}
            </Button>
          )}
          
          <Button variant="outline">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Document Settings
          </Button>
        </div>
      </div>
      
      {loadingAssociations ? (
        <div className="flex justify-center py-4">
          <RefreshCwIcon className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : associations.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <FolderIcon className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">Association:</span>
          </div>
          <Select 
            value={selectedAssociationId || ''} 
            onValueChange={handleAssociationChange}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select an association" />
            </SelectTrigger>
            <SelectContent>
              {associations.map(association => (
                <SelectItem key={association.id} value={association.id}>
                  {association.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
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
      
      {showUploader && bucketReady && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
            <CardDescription>
              Upload a new document to your association
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentUploader
              associationId={selectedAssociationId}
              onUploadComplete={handleUploadComplete}
            />
          </CardContent>
        </Card>
      )}
      
      {bucketReady && !showUploader && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="documents">All Documents</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="recent">Recently Viewed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents" className="mt-6">
            <DocumentManager associationId={selectedAssociationId} />
          </TabsContent>
          
          <TabsContent value="templates" className="mt-6">
            <Card>
              <CardContent className="p-6 text-center">
                <FolderIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Document Templates</h3>
                <p className="text-muted-foreground mb-4">
                  Create and manage reusable document templates for your association.
                </p>
                <Button>Browse Templates</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recent" className="mt-6">
            <Card>
              <CardContent className="p-6 text-center">
                <FolderIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Recently Viewed</h3>
                <p className="text-muted-foreground mb-4">
                  Quick access to your recently viewed documents.
                </p>
                <Button>View History</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
