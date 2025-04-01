
import React, { useState } from 'react';
import { useHtmlTemplates } from '@/hooks/use-html-templates';
import { HtmlTemplate } from '@/services/htmlTemplateService';
import HtmlTemplateEditor from './HtmlTemplateEditor';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';

interface HtmlTemplatesProps {
  associationId?: string;
}

const HtmlTemplates: React.FC<HtmlTemplatesProps> = ({ associationId }) => {
  const { isAuthenticated } = useAuth();
  const { 
    templates, 
    isLoading, 
    createTemplate, 
    updateTemplate, 
    deleteTemplate 
  } = useHtmlTemplates(associationId);

  const [selectedTemplate, setSelectedTemplate] = useState<HtmlTemplate | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (template.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'global' && template.is_global) ||
      (activeTab === 'association' && !template.is_global) ||
      activeTab === template.category.toLowerCase();
    
    return matchesSearch && matchesTab;
  });
  
  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setIsEditorOpen(true);
  };
  
  const handleEdit = (template: HtmlTemplate) => {
    setSelectedTemplate(template);
    setIsEditorOpen(true);
  };
  
  const handlePreview = (template: HtmlTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };
  
  const handleSaveTemplate = async (template: Omit<HtmlTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    if (selectedTemplate) {
      await updateTemplate(selectedTemplate.id, template);
    } else {
      await createTemplate(template);
    }
    setIsEditorOpen(false);
  };
  
  const handleDeleteTemplate = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      await deleteTemplate(id);
    }
  };
  
  const categories = [...new Set(templates.map(template => template.category))];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <CardTitle>HTML Templates</CardTitle>
              <CardDescription>
                Create and manage reusable HTML templates for communications
              </CardDescription>
            </div>
            <Button onClick={handleCreateNew} disabled={!isAuthenticated} className="mt-4 md:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                <TabsList className="h-9">
                  <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                  <TabsTrigger value="global" className="text-xs">Global</TabsTrigger>
                  <TabsTrigger value="association" className="text-xs">Association</TabsTrigger>
                  {categories.map(category => (
                    <TabsTrigger 
                      key={category} 
                      value={category.toLowerCase()}
                      className="text-xs"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : filteredTemplates.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Scope</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell>{template.category}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${template.is_global ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                            {template.is_global ? 'Global' : 'Association'}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell max-w-xs truncate">
                          {template.description || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handlePreview(template)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEdit(template)}
                              disabled={!isAuthenticated}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteTemplate(template.id)}
                              disabled={!isAuthenticated}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  {searchQuery 
                    ? `No templates match "${searchQuery}"` 
                    : 'No templates available'}
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleCreateNew}
                  disabled={!isAuthenticated}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate ? 'Edit HTML Template' : 'Create HTML Template'}
            </DialogTitle>
          </DialogHeader>
          <HtmlTemplateEditor
            selectedTemplate={selectedTemplate}
            onSave={handleSaveTemplate}
            onCancel={() => setIsEditorOpen(false)}
            onPreview={() => {
              setIsEditorOpen(false);
              setIsPreviewOpen(true);
            }}
            isReadOnly={!isAuthenticated}
            associationId={associationId}
          />
        </DialogContent>
      </Dialog>
      
      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate ? `Preview: ${selectedTemplate.name}` : 'Preview Template'}
            </DialogTitle>
          </DialogHeader>
          <div className="border rounded-md p-4 mt-4 bg-white">
            {selectedTemplate && (
              <div dangerouslySetInnerHTML={{ __html: selectedTemplate.content }} />
            )}
          </div>
          <div className="flex justify-end mt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsPreviewOpen(false);
                if (selectedTemplate) {
                  setSelectedTemplate(selectedTemplate);
                  setIsEditorOpen(true);
                }
              }}
              disabled={!isAuthenticated}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HtmlTemplates;
