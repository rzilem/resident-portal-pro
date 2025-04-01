import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DocumentList from '@/components/documents/DocumentList';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, FolderPlus, Folder } from 'lucide-react';
import { associationService } from '@/services/associationService';
import { Association } from '@/types/association';
import HtmlTemplates from '@/components/communications/html-templates/HtmlTemplates';
import { useDocumentList } from '@/hooks/use-document-list';

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
  const [selectedAssociationId, setSelectedAssociationId] = useState<string>(urlId || '');
  const [associations, setAssociations] = useState<Association[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('documents');
  
  useEffect(() => {
    const fetchAssociations = async () => {
      setIsLoading(true);
      try {
        const fetchedAssociations = await associationService.getAssociations();
        setAssociations(fetchedAssociations);
        
        if (!selectedAssociationId && fetchedAssociations.length > 0) {
          setSelectedAssociationId(fetchedAssociations[0].id);
        }
      } catch (error) {
        console.error('Error fetching associations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAssociations();
  }, []);
  
  useEffect(() => {
    if (urlId && urlId !== selectedAssociationId) {
      setSelectedAssociationId(urlId);
    }
  }, [urlId]);
  
  const selectedAssociation = associations.find(a => a.id === selectedAssociationId);
  
  const { documents, loading, searchQuery: filteredSearchQuery, setSearchQuery: setFilteredSearchQuery, fetchDocuments, deleteDocument } = useDocumentList({
    associationId: selectedAssociationId,
    category: activeCategory !== 'all' ? activeCategory : undefined
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Association Documents</h1>
        <p className="text-muted-foreground">
          Manage documents and templates for your associations
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="association-select">Select Association</Label>
                  <select
                    id="association-select"
                    value={selectedAssociationId}
                    onChange={(e) => setSelectedAssociationId(e.target.value)}
                    className="w-full p-2 border rounded-md mt-1"
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
                        value={filteredSearchQuery}
                        onChange={(e) => setFilteredSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label>Document Categories</Label>
                      <ul className="mt-2 space-y-1">
                        {DOCUMENT_CATEGORIES.filter(category => 
                          category.name.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((category) => (
                          <li key={category.id}>
                            <Button
                              variant={activeCategory === category.id ? "secondary" : "ghost"}
                              className="w-full justify-start"
                              onClick={() => {
                                setActiveCategory(category.id);
                                setActiveTab('documents');
                              }}
                            >
                              <Folder className="h-4 w-4 mr-2" />
                              {category.name}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full gap-2"
                      onClick={() => {
                        // Logic to create new category would go here
                      }}
                    >
                      <FolderPlus className="h-4 w-4" />
                      Create Category
                    </Button>
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
                        associationId={selectedAssociationId}
                        category={activeCategory !== 'all' ? activeCategory : undefined}
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
