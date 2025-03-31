
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LetterTemplatesList from '@/components/letter-templates/LetterTemplatesList';
import LetterTemplateEditor from '@/components/letter-templates/LetterTemplateEditor';
import { useLetterTemplates } from '@/hooks/use-letter-templates';

const LetterTemplates = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  
  const { 
    templates, 
    isLoading,
    createTemplate,
    updateTemplate,
    deleteTemplate
  } = useLetterTemplates();
  
  const selectedTemplate = selectedTemplateId 
    ? templates.find(t => t.id === selectedTemplateId) 
    : null;
  
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Letter Templates</h1>
        <p className="text-muted-foreground">
          Create and manage letter templates for communications, compliance, delinquency notices and more
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Manage Letter Templates</CardTitle>
              <CardDescription>
                Create, edit and organize templates for various communication needs
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="all">All Templates</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="delinquency">Delinquency</TabsTrigger>
              <TabsTrigger value="arc">Architectural</TabsTrigger>
            </TabsList>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <TabsContent value="all" className="m-0">
                  <LetterTemplatesList 
                    templates={templates} 
                    isLoading={isLoading}
                    onSelect={setSelectedTemplateId}
                    selectedId={selectedTemplateId}
                    category="all"
                    onDelete={deleteTemplate}
                  />
                </TabsContent>
                
                <TabsContent value="compliance" className="m-0">
                  <LetterTemplatesList 
                    templates={templates.filter(t => t.category === 'Compliance')} 
                    isLoading={isLoading}
                    onSelect={setSelectedTemplateId}
                    selectedId={selectedTemplateId}
                    category="Compliance"
                    onDelete={deleteTemplate}
                  />
                </TabsContent>
                
                <TabsContent value="delinquency" className="m-0">
                  <LetterTemplatesList 
                    templates={templates.filter(t => t.category === 'Delinquency')} 
                    isLoading={isLoading}
                    onSelect={setSelectedTemplateId}
                    selectedId={selectedTemplateId}
                    category="Delinquency"
                    onDelete={deleteTemplate}
                  />
                </TabsContent>
                
                <TabsContent value="arc" className="m-0">
                  <LetterTemplatesList 
                    templates={templates.filter(t => t.category === 'Architectural')} 
                    isLoading={isLoading}
                    onSelect={setSelectedTemplateId}
                    selectedId={selectedTemplateId}
                    category="Architectural"
                    onDelete={deleteTemplate}
                  />
                </TabsContent>
              </div>
              
              <div className="md:col-span-2">
                <LetterTemplateEditor
                  selectedTemplate={selectedTemplate}
                  onSave={selectedTemplateId ? updateTemplate : createTemplate}
                  onCancel={() => setSelectedTemplateId(null)}
                />
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LetterTemplates;
