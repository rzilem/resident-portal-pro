
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TooltipButton } from '@/components/ui/tooltip-button';
import { Search, FolderPlus, Folder, Upload, ArrowLeft } from 'lucide-react';
import { useAssociations } from '@/hooks/use-associations';
import HtmlTemplates from '@/components/communications/html-templates/HtmlTemplates';
import DocumentList from '@/components/documents/DocumentList';
import { useDocumentList } from '@/hooks/use-document-list';
import DocumentUploader from '@/components/documents/DocumentUploader';
import { toast } from 'sonner';

const DOCUMENT_CATEGORIES = [
  { id: 'all', name: 'All Documents' },
  { id: 'financial', name: 'Financial' },
  { id: 'legal', name: 'Legal' },
  { id: 'meeting', name: 'Meeting' },
  { id: 'maintenance', name: 'Maintenance' },
  { id: 'communication', name: 'Communication' },
  { id: 'templates', name: 'Templates' }
];

const AssociationDocuments: React.FC = () => {
  const { id: urlId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedAssociationId, setSelectedAssociationId] = useState<string>(urlId || '');
  const [associations, setAssociations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('documents');
  const [showUploader, setShowUploader] = useState(false);
  
  const { associations: fetchedAssociations, loading: loadingAssociations } = useAssociations();
  
  useEffect(() => {
    if (!loadingAssociations) {
      setAssociations(fetchedAssociations);
      setIsLoading(false);
      
      if (!selectedAssociationId && fetchedAssociations.length > 0) {
        setSelectedAssociationId(fetchedAssociations[0].id);
      }
    }
  }, [fetchedAssociations, loadingAssociations, selectedAssociationId]);
  
  useEffect(() => {
    if (urlId && urlId !== selectedAssociationId) {
      setSelectedAssociationId(urlId);
    }
  }, [urlId, selectedAssociationId]);
  
  const selectedAssociation = associations.find(a => a.id === selectedAssociationId);
  
  const { 
    documents, 
    loading: documentsLoading, 
    error: documentsError,
    refreshDocuments,
    deleteDocument
  } = useDocumentList({
    associationId: selectedAssociationId,
    category: activeCategory !== 'all' ? activeCategory : undefined
  });

  const handleUploadComplete = () => {
    toast.success('Document uploaded successfully');
    setShowUploader(false);
    refreshDocuments();
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/documents')}
            className="mb-2 -ml-2 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Documents
          </Button>
          <h1 className="text-3xl font-semibold">Association Documents</h1>
          <p className="text-muted-foreground">
            Manage documents and templates for your associations
          </p>
        </div>
        
        {selectedAssociationId && !showUploader && (
          <Button 
            onClick={() => setShowUploader(true)}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
        )}
      </div>
      
      {showUploader && selectedAssociationId && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
            <DocumentUploader
              associationId={selectedAssociationId}
              onUploadComplete={handleUploadComplete}
              onCancel={() => setShowUploader(false)}
            />
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="association-select" className="block text-sm font-medium mb-1">
                    Select Association
                  </label>
                  <select
                    id="association-select"
                    value={selectedAssociationId}
                    onChange={(e) => setSelectedAssociationId(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    disabled={isLoading}
                  >
                    <option value="" disabled>Select an association</option>
                    {associations.map((association) => (
                      <option key={association.id} value={association.id}>
                        {association.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {selectedAssociationId && (
                  <>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium mb-1">
                        Document Categories
                      </label>
                      <ul className="mt-2 space-y-1">
                        {DOCUMENT_CATEGORIES.filter(category => 
                          category.name.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((category) => (
                          <li key={category.id}>
                            <TooltipButton
                              variant={activeCategory === category.id ? "secondary" : "ghost"}
                              className="w-full justify-start"
                              tooltipText={`View ${category.name} documents`}
                              onClick={() => {
                                setActiveCategory(category.id);
                                setActiveTab('documents');
                              }}
                            >
                              <Folder className="h-4 w-4 mr-2" />
                              {category.name}
                            </TooltipButton>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <TooltipButton 
                      variant="outline" 
                      className="w-full gap-2"
                      tooltipText="Create a new document category"
                      onClick={() => {
                        // Logic to create new category would go here
                        toast.info('Create category feature coming soon');
                      }}
                    >
                      <FolderPlus className="h-4 w-4" />
                      Create Category
                    </TooltipButton>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3 space-y-6">
          {selectedAssociationId ? (
            <>
              <Card>
                <CardContent className="pt-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="documents">Documents</TabsTrigger>
                      <TabsTrigger value="html-templates">HTML Templates</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="documents" className="mt-0">
                      <DocumentList 
                        documents={documents}
                        loading={documentsLoading}
                        error={documentsError}
                        onDeleteDocument={deleteDocument}
                        onRefresh={refreshDocuments}
                      />
                    </TabsContent>
                    
                    <TabsContent value="html-templates" className="mt-0">
                      <HtmlTemplates 
                        associationId={selectedAssociationId}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Association Selected</h3>
                <p className="text-muted-foreground mb-4">
                  Please select an association to view its documents
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssociationDocuments;
