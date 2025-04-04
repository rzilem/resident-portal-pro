
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import LetterTemplatesList from '@/components/letter-templates/LetterTemplatesList';
import LetterTemplateEditor from '@/components/letter-templates/LetterTemplateEditor';
import LetterTemplatePreview from '@/components/letter-templates/LetterTemplatePreview';
import { useLetterTemplates } from '@/hooks/use-letter-templates';
import { useAuth } from '@/hooks/use-auth';
import { LetterTemplate } from '@/types/letter-templates';
import { Skeleton } from '@/components/ui/skeleton';
import { TooltipButton } from '@/components/ui/tooltip-button';

const LetterTemplates = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const { user } = useAuth();
  const [authLoading, setAuthLoading] = useState(true);
  
  // Set auth loading state to false after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
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
  
  // Clear selected template when changing tabs
  useEffect(() => {
    setSelectedTemplateId(null);
    setIsPreviewMode(false);
  }, [activeTab]);
  
  const isUserAuthenticated = !!user;
  
  // Wrapper function to handle the different function signatures
  const handleSaveTemplate = async (template: Omit<LetterTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedTemplateId) {
      return await updateTemplate(selectedTemplateId, template);
    } else {
      return await createTemplate(template);
    }
  };

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id);
    setIsPreviewMode(false); // Exit preview mode when selecting a template
  };

  const handlePreviewToggle = () => {
    setIsPreviewMode(!isPreviewMode);
  };
  
  const filteredTemplates = (category: string) => {
    if (category === 'all') return templates;
    return templates.filter(t => t.category === category);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Letter Templates</h1>
        <p className="text-muted-foreground">
          Create and manage letter templates for communications, compliance, delinquency notices and more
        </p>
      </div>
      
      {!isUserAuthenticated && !authLoading && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please log in to create or modify letter templates. You can view existing templates in read-only mode.
          </AlertDescription>
        </Alert>
      )}
      
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
              <TabsTrigger value="Compliance">Compliance</TabsTrigger>
              <TabsTrigger value="Delinquency">Delinquency</TabsTrigger>
              <TabsTrigger value="Architectural">Architectural</TabsTrigger>
            </TabsList>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-[500px] w-full" />
                  </div>
                ) : (
                  <LetterTemplatesList 
                    templates={filteredTemplates(activeTab)} 
                    isLoading={isLoading}
                    onSelect={handleSelectTemplate}
                    selectedId={selectedTemplateId}
                    category={activeTab}
                    onDelete={deleteTemplate}
                    isReadOnly={!isUserAuthenticated}
                  />
                )}
              </div>
              
              <div className="md:col-span-2">
                {isPreviewMode && selectedTemplate ? (
                  <LetterTemplatePreview 
                    template={selectedTemplate} 
                    onBack={handlePreviewToggle}
                    onEdit={() => setIsPreviewMode(false)}
                    isReadOnly={!isUserAuthenticated}
                  />
                ) : (
                  <LetterTemplateEditor
                    selectedTemplate={selectedTemplate}
                    onSave={handleSaveTemplate}
                    onCancel={() => setSelectedTemplateId(null)}
                    onPreview={handlePreviewToggle}
                    isReadOnly={!isUserAuthenticated}
                  />
                )}
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LetterTemplates;
