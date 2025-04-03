
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { SearchIcon, FolderIcon, FileTextIcon, UploadIcon, FilterIcon } from "lucide-react";
import { useDocuments } from '@/hooks/use-documents';
import DocumentUploader from './DocumentUploader';
import DocumentList from './DocumentList';
import DocumentCategorySelector from './DocumentCategorySelector';
import { Separator } from '@/components/ui/separator';

interface DocumentManagerProps {
  associationId?: string;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({ 
  associationId = '00000000-0000-0000-0000-000000000000'  // Default system-wide association
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [showUploader, setShowUploader] = useState(false);
  
  const { 
    documents, 
    isLoading, 
    error, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory,
    setCategory,
    fetchDocuments,
    deleteDocument,
    downloadDocument
  } = useDocuments(associationId);

  const handleUploadComplete = () => {
    setShowUploader(false);
    fetchDocuments();
  };

  const handleCategoryChange = (category: string) => {
    setCategory(category);
  };

  const documentCount = documents.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Documents</h2>
          <p className="text-muted-foreground">
            {documentCount} document{documentCount !== 1 ? 's' : ''} available
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={showUploader ? "default" : "outline"} 
            onClick={() => setShowUploader(!showUploader)}
          >
            <UploadIcon className="h-4 w-4 mr-2" />
            {showUploader ? "Cancel Upload" : "Upload Document"}
          </Button>
        </div>
      </div>

      {showUploader && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
            <CardDescription>
              Upload a new document to the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentUploader 
              associationId={associationId}
              initialCategory={selectedCategory}
              onUploadComplete={handleUploadComplete}
              onCancel={() => setShowUploader(false)}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <DocumentCategorySelector 
              selectedCategory={selectedCategory || 'all'}
              onChange={handleCategoryChange}
            />
          </div>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="recent">Recently Added</TabsTrigger>
              <TabsTrigger value="shared">Shared With Me</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="m-0">
              <DocumentList 
                documents={documents}
                loading={isLoading}
                error={error}
                onDeleteDocument={deleteDocument}
                onDownloadDocument={downloadDocument}
                onRefresh={fetchDocuments}
              />
            </TabsContent>
            
            <TabsContent value="recent" className="m-0">
              <DocumentList 
                documents={documents.slice().sort((a, b) => 
                  new Date(b.uploadedDate).getTime() - new Date(a.uploadedDate).getTime()
                ).slice(0, 10)}
                loading={isLoading}
                error={error}
                onDeleteDocument={deleteDocument}
                onDownloadDocument={downloadDocument}
                onRefresh={fetchDocuments}
              />
            </TabsContent>
            
            <TabsContent value="shared" className="m-0">
              <DocumentList 
                documents={documents.filter(doc => doc.isPublic)}
                loading={isLoading}
                error={error}
                onDeleteDocument={deleteDocument}
                onDownloadDocument={downloadDocument}
                onRefresh={fetchDocuments}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentManager;
