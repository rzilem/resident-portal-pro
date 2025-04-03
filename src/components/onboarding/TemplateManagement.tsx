
import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { onboardingService } from '@/services/onboardingService';
import { OnboardingTemplate } from '@/types/onboarding';
import TemplateList from './TemplateList';
import TemplateEditor from './TemplateEditor';

const TemplateManagement: React.FC = () => {
  const [templates, setTemplates] = useState<OnboardingTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<OnboardingTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<OnboardingTemplate | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'onboarding' | 'offboarding'>('all');
  
  // Load templates
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setIsLoading(true);
        const templatesData = await onboardingService.getTemplates();
        setTemplates(templatesData);
        setFilteredTemplates(templatesData);
      } catch (error) {
        console.error('Error loading templates:', error);
        toast.error('Failed to load templates');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTemplates();
  }, []);
  
  // Filter templates based on search query and active tab
  useEffect(() => {
    let filtered = templates;
    
    // Filter by tab (process type)
    if (activeTab !== 'all') {
      filtered = filtered.filter(template => template.processType === activeTab);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.clientType?.toLowerCase().includes(query) ||
        template.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredTemplates(filtered);
  }, [searchQuery, templates, activeTab]);
  
  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setIsEditorOpen(true);
  };
  
  const handleEditTemplate = (template: OnboardingTemplate) => {
    setSelectedTemplate(template);
    setIsEditorOpen(true);
  };
  
  const handleDuplicateTemplate = async (template: OnboardingTemplate) => {
    try {
      // Create a new template based on the selected one
      const { id, createdAt, updatedAt, ...templateData } = template;
      
      const duplicatedTemplate = {
        ...templateData,
        name: `${template.name} (Copy)`,
        isDefault: false
      };
      
      const newTemplate = await onboardingService.createTemplate(duplicatedTemplate);
      setTemplates([...templates, newTemplate]);
      toast.success('Template duplicated successfully');
    } catch (error) {
      console.error('Error duplicating template:', error);
      toast.error('Failed to duplicate template');
    }
  };
  
  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await onboardingService.deleteTemplate(templateId);
      setTemplates(templates.filter(t => t.id !== templateId));
      toast.success('Template deleted successfully');
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  };
  
  const handleSaveTemplate = async (template: OnboardingTemplate) => {
    try {
      if (selectedTemplate) {
        // Update existing template
        const updatedTemplate = await onboardingService.updateTemplate(
          selectedTemplate.id,
          template
        );
        
        if (updatedTemplate) {
          setTemplates(templates.map(t => 
            t.id === updatedTemplate.id ? updatedTemplate : t
          ));
          toast.success('Template updated successfully');
        }
      } else {
        // Create new template
        const newTemplate = await onboardingService.createTemplate(template);
        setTemplates([...templates, newTemplate]);
        toast.success('Template created successfully');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
      throw error;
    }
  };
  
  const handleSelectTemplate = (template: OnboardingTemplate) => {
    // To be implemented in the future if needed
    toast.info(`Template "${template.name}" selected`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:items-center">
        <h1 className="text-2xl font-bold">Process Templates</h1>
        
        <div className="flex space-x-2">
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
          
          <Button onClick={handleCreateTemplate}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | 'onboarding' | 'offboarding')}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="offboarding">Offboarding</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="text-center py-10">Loading templates...</div>
      ) : (
        <TemplateList 
          templates={filteredTemplates}
          onCreateTemplate={handleCreateTemplate}
          onEditTemplate={handleEditTemplate}
          onDeleteTemplate={handleDeleteTemplate}
          onDuplicateTemplate={handleDuplicateTemplate}
          onSelectTemplate={handleSelectTemplate}
        />
      )}
      
      <TemplateEditor 
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        template={selectedTemplate}
        onSave={handleSaveTemplate}
      />
    </div>
  );
};

export default TemplateManagement;
