
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { MessageTemplate, MessageTemplatesProps } from './templates/types';
import TemplateCard from './templates/TemplateCard';
import TemplateEditorDialog from './templates/TemplateEditorDialog';
import TemplatePreviewDialog from './templates/TemplatePreviewDialog';

const MessageTemplates: React.FC<MessageTemplatesProps> = ({ 
  onSelectTemplate,
  templates,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<MessageTemplate | null>(null);
  
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateSubject, setTemplateSubject] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  const [templateCategory, setTemplateCategory] = useState('General');
  const [isHtmlFormat, setIsHtmlFormat] = useState(true);
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>(['all']);

  const resetForm = () => {
    setTemplateName('');
    setTemplateDescription('');
    setTemplateSubject('');
    setTemplateContent('');
    setTemplateCategory('General');
    setSelectedCommunities(['all']);
    setIsHtmlFormat(true);
  };

  const handleCreateTemplate = () => {
    if (!templateName.trim() || !templateSubject.trim() || !templateContent.trim()) {
      toast.error('Please fill out all required fields');
      return;
    }

    const newTemplate: MessageTemplate = {
      id: Date.now().toString(),
      name: templateName,
      description: templateDescription,
      subject: templateSubject,
      content: templateContent,
      category: templateCategory,
      communities: selectedCommunities,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onCreateTemplate(newTemplate);
    setIsCreateDialogOpen(false);
    resetForm();
    toast.success('Template created successfully');
  };

  const handleEditTemplate = () => {
    if (!selectedTemplate) return;
    
    if (!templateName.trim() || !templateSubject.trim() || !templateContent.trim()) {
      toast.error('Please fill out all required fields');
      return;
    }

    const updatedTemplate: MessageTemplate = {
      ...selectedTemplate,
      name: templateName,
      description: templateDescription,
      subject: templateSubject,
      content: templateContent,
      category: templateCategory,
      communities: selectedCommunities,
      updatedAt: new Date().toISOString()
    };

    onUpdateTemplate(updatedTemplate);
    setIsEditDialogOpen(false);
    resetForm();
    toast.success('Template updated successfully');
  };

  const handleDeleteTemplate = (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    
    onDeleteTemplate(id);
    toast.success('Template deleted');
  };

  const openEditDialog = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setTemplateName(template.name);
    setTemplateDescription(template.description);
    setTemplateSubject(template.subject);
    setTemplateContent(template.content);
    setTemplateCategory(template.category);
    setSelectedCommunities(template.communities || ['all']);
    setIsHtmlFormat(true);
    setIsEditDialogOpen(true);
  };

  const openPreviewDialog = (template: MessageTemplate) => {
    setPreviewTemplate(template);
    setIsPreviewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Message Templates</h2>
        <Button onClick={() => {
          resetForm();
          setIsCreateDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {templates.map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            onPreview={openPreviewDialog}
            onEdit={openEditDialog}
            onDelete={handleDeleteTemplate}
            onSelect={onSelectTemplate}
          />
        ))}
      </div>

      {/* Template Editor Dialog - Create */}
      <TemplateEditorDialog
        type="create"
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSave={handleCreateTemplate}
        template={{
          name: templateName,
          description: templateDescription,
          subject: templateSubject,
          content: templateContent,
          category: templateCategory,
          communities: selectedCommunities,
          isHtmlFormat
        }}
        setTemplate={{
          setName: setTemplateName,
          setDescription: setTemplateDescription,
          setSubject: setTemplateSubject,
          setContent: setTemplateContent,
          setCategory: setTemplateCategory,
          setCommunities: setSelectedCommunities,
          setIsHtmlFormat: setIsHtmlFormat
        }}
      />

      {/* Template Editor Dialog - Edit */}
      <TemplateEditorDialog
        type="edit"
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleEditTemplate}
        template={{
          name: templateName,
          description: templateDescription,
          subject: templateSubject,
          content: templateContent,
          category: templateCategory,
          communities: selectedCommunities,
          isHtmlFormat
        }}
        setTemplate={{
          setName: setTemplateName,
          setDescription: setTemplateDescription,
          setSubject: setTemplateSubject,
          setContent: setTemplateContent,
          setCategory: setTemplateCategory,
          setCommunities: setSelectedCommunities,
          setIsHtmlFormat: setIsHtmlFormat
        }}
      />

      {/* Template Preview Dialog */}
      <TemplatePreviewDialog
        isOpen={isPreviewDialogOpen}
        onClose={() => setIsPreviewDialogOpen(false)}
        template={previewTemplate}
        onUseTemplate={onSelectTemplate}
      />
    </div>
  );
};

export default MessageTemplates;
