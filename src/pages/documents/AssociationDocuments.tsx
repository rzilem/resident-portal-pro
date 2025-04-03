
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, FolderPlus } from 'lucide-react';
import DocumentList from '@/components/documents/DocumentList';
import { useDocuments } from '@/hooks/use-documents';
import { getDocumentCategories } from '@/services/documentService';
import DocumentUploader from '@/components/documents/DocumentUploader';
import { DocumentFile } from '@/types/documents';
import { useEffect } from 'react';

const AssociationDocuments = () => {
  const { id: associationId } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('all');
  const [showUploader, setShowUploader] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Use our documents hook
  const {
    documents,
    isLoading,
    fetchDocuments,
    deleteDocument,
    downloadDocument
  } = useDocuments(associationId, activeTab !== 'all' ? activeTab : undefined);
  
  // Fetch document categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getDocumentCategories();
        setCategories(['all', ...fetchedCategories]);
      } catch (error) {
        console.error('Error fetching document categories:', error);
      }
    };
    
    fetchCategories();
  }, []);
  
  const handleUploadComplete = (document: DocumentFile) => {
    setShowUploader(false);
    fetchDocuments();
  };
  
  if (!associationId) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-medium mb-2">No Association Selected</h2>
            <p className="text-muted-foreground">
              Please select an association to view its documents.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Association Documents</h1>
        <Button onClick={() => setShowUploader(true)} disabled={showUploader}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>
      
      {showUploader ? (
        <Card>
          <CardContent className="p-6">
            <DocumentUploader 
              associationId={associationId}
              onUploadComplete={handleUploadComplete}
              onCancel={() => setShowUploader(false)}
              category={activeTab !== 'all' ? activeTab : undefined}
            />
          </CardContent>
        </Card>
      ) : null}
      
      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category === 'all' ? 'All Documents' : category.replace(/-/g, ' ')}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <Button variant="outline" size="sm">
            <FolderPlus className="h-4 w-4 mr-2" />
            Manage Categories
          </Button>
        </div>
        
        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            <DocumentList 
              documents={documents}
              isLoading={isLoading}
              onDelete={deleteDocument}
              onDownload={downloadDocument}
              associationId={associationId}
              category={category !== 'all' ? category : undefined}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AssociationDocuments;
