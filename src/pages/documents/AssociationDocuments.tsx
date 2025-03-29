
import React, { useState, useEffect, useRef } from 'react';
import DashboardHeaderWithNav from '@/components/DashboardHeaderWithNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { File, Folder, FileText, Upload, Download, Search, Clock, BookMarked, Star } from 'lucide-react';
import DocumentCategoryList from '@/components/documents/DocumentCategoryList';
import DocumentSearch from '@/components/documents/DocumentSearch';
import DocumentTable from '@/components/documents/DocumentTable';
import DocumentUploadDialog from '@/components/documents/DocumentUploadDialog';
import { DOCUMENT_CATEGORIES } from '@/components/database/DocumentCategoryStructure';
import AssociationSelector from '@/components/documents/AssociationSelector';
import { useAssociations } from '@/hooks/use-associations';
import { DocumentFile, DocumentCategory, DocumentSearchFilters } from '@/types/documents';
import { getDocuments } from '@/utils/documents/index';
import { getDocumentCategories } from '@/utils/documents/uploadUtils';
import DocumentPreview from '@/components/documents/DocumentPreview';
import DocumentTemplates from '@/components/documents/templates/DocumentTemplates';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const AssociationDocuments = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<DocumentSearchFilters>({});
  const [selectedDocument, setSelectedDocument] = useState<DocumentFile | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { activeAssociation } = useAssociations();
  const { toast } = useToast();
  
  useEffect(() => {
    loadCategories();
  }, []);
  
  const loadCategories = async () => {
    try {
      const cats = await getDocumentCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Failed to load document categories:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load document categories"
      });
    }
  };
  
  const refreshDocuments = () => {
    console.log('Refreshing documents list');
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCategoryUpdate = (updatedCategory: DocumentCategory) => {
    console.log('Category updated:', updatedCategory);
    
    setCategories(prevCategories => 
      prevCategories.map(cat => 
        cat.id === updatedCategory.id ? updatedCategory : cat
      )
    );
    
    toast({
      title: "Category Updated",
      description: `${updatedCategory.name} has been updated successfully`
    });
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleAdvancedSearch = (filters: DocumentSearchFilters) => {
    setAdvancedFilters(filters);
    if (filters.query) {
      setSearchQuery(filters.query);
    }
  };
  
  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
  };
  
  const handleDocumentView = (document: DocumentFile) => {
    setSelectedDocument(document);
    setShowPreview(true);
  };
  
  const handleUploadSuccess = () => {
    toast({
      title: "Upload Successful",
      description: "Document has been uploaded successfully"
    });
    refreshDocuments();
  };
  
  const getCategoryName = () => {
    if (!activeCategory) return 'All Documents';
    const category = categories.find(c => c.id === activeCategory);
    return category ? category.name : 'Documents';
  };
  
  return (
    <>
      <DashboardHeaderWithNav
        title="Association Documents"
        icon={<FileText className="h-6 w-6" />}
      />
      
      <div className="container mx-auto p-4 md:p-6">
        <div className="mb-6 flex justify-end">
          <AssociationSelector className="ml-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle>Document Categories</CardTitle>
                <CardDescription>Browse document categories</CardDescription>
              </CardHeader>
              <CardContent>
                <DocumentCategoryList 
                  categories={categories}
                  activeCategory={activeCategory}
                  onSelectCategory={handleCategorySelect}
                  onUpdateCategory={handleCategoryUpdate}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <DocumentSearch 
                  onSearch={handleSearch} 
                  onAdvancedSearch={handleAdvancedSearch}
                />
                <Button onClick={() => setShowUploadDialog(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
              
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      {getCategoryName()}
                      {activeAssociation && (
                        <span className="text-sm font-normal text-muted-foreground ml-2">
                          ({activeAssociation.name})
                        </span>
                      )}
                    </CardTitle>
                    <Download className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary" />
                  </div>
                  <CardDescription>
                    {searchQuery ? `Search results for "${searchQuery}"` : 'Browse and manage documents'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
                    <TabsList>
                      <TabsTrigger value="all" className="flex items-center gap-1">
                        <File className="h-4 w-4" />
                        All
                      </TabsTrigger>
                      <TabsTrigger value="recent" className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Recent
                      </TabsTrigger>
                      <TabsTrigger value="shared" className="flex items-center gap-1">
                        <Folder className="h-4 w-4" />
                        Shared
                      </TabsTrigger>
                      <TabsTrigger value="important" className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        Important
                      </TabsTrigger>
                      <TabsTrigger value="templates" className="flex items-center gap-1">
                        <BookMarked className="h-4 w-4" />
                        Templates
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all" className="space-y-4">
                      <DocumentTable 
                        category={activeCategory} 
                        searchQuery={searchQuery}
                        associationId={activeAssociation?.id}
                        refreshTrigger={refreshTrigger}
                      />
                    </TabsContent>
                    
                    <TabsContent value="recent" className="space-y-4">
                      <DocumentTable 
                        category={activeCategory} 
                        searchQuery={searchQuery}
                        filter="recent"
                        associationId={activeAssociation?.id}
                        refreshTrigger={refreshTrigger}
                      />
                    </TabsContent>
                    
                    <TabsContent value="shared" className="space-y-4">
                      <DocumentTable 
                        category={activeCategory} 
                        searchQuery={searchQuery}
                        filter="shared"
                        associationId={activeAssociation?.id}
                        refreshTrigger={refreshTrigger}
                      />
                    </TabsContent>
                    
                    <TabsContent value="important" className="space-y-4">
                      <DocumentTable 
                        category={activeCategory} 
                        searchQuery={searchQuery}
                        filter="important"
                        associationId={activeAssociation?.id}
                        refreshTrigger={refreshTrigger}
                      />
                    </TabsContent>
                    
                    <TabsContent value="templates" className="space-y-4 m-0">
                      <DocumentTemplates />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <DocumentUploadDialog 
        open={showUploadDialog}
        setOpen={setShowUploadDialog}
        onSuccess={handleUploadSuccess}
        refreshDocuments={refreshDocuments}
      />
      
      <DocumentPreview
        document={selectedDocument}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </>
  );
};

export default AssociationDocuments;
