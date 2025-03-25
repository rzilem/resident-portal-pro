
import { useState } from 'react';
import { MessageTemplate } from '../types';
import { toast } from 'sonner';

export const useTemplateEditor = (
  onCreateTemplate: (template: MessageTemplate) => void,
  onUpdateTemplate: (template: MessageTemplate) => void
) => {
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
    resetForm();
    toast.success('Template created successfully');
    return true;
  };

  const handleEditTemplate = (selectedTemplate: MessageTemplate | null) => {
    if (!selectedTemplate) return false;
    
    if (!templateName.trim() || !templateSubject.trim() || !templateContent.trim()) {
      toast.error('Please fill out all required fields');
      return false;
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
    resetForm();
    toast.success('Template updated successfully');
    return true;
  };

  const setupFormForTemplate = (template: MessageTemplate) => {
    setTemplateName(template.name);
    setTemplateDescription(template.description);
    setTemplateSubject(template.subject);
    setTemplateContent(template.content);
    setTemplateCategory(template.category);
    setSelectedCommunities(template.communities || ['all']);
    setIsHtmlFormat(true);
  };

  return {
    templateForm: {
      name: templateName,
      description: templateDescription,
      subject: templateSubject,
      content: templateContent,
      category: templateCategory,
      communities: selectedCommunities,
      isHtmlFormat
    },
    setTemplateForm: {
      setName: setTemplateName,
      setDescription: setTemplateDescription,
      setSubject: setTemplateSubject,
      setContent: setTemplateContent,
      setCategory: setTemplateCategory,
      setCommunities: setSelectedCommunities,
      setIsHtmlFormat: setIsHtmlFormat
    },
    resetForm,
    handleCreateTemplate,
    handleEditTemplate,
    setupFormForTemplate
  };
};
