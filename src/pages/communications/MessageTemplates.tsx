
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import TemplateManager from '@/components/communications/templates/TemplateManager';
import { MessageTemplate } from '@/pages/communications/types';
import { INITIAL_TEMPLATES } from './useCommunityMessaging';
import { toast } from 'sonner';

const MessageTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<MessageTemplate[]>(INITIAL_TEMPLATES);

  const handleSelectTemplate = (template: MessageTemplate) => {
    console.log('Selected template:', template);
    // Normally you would navigate to template use or something similar
    toast.info(`Template "${template.name}" selected`);
  };

  const handleCreateTemplate = async (template: MessageTemplate): Promise<void> => {
    setTemplates(prev => [...prev, template]);
    toast.success('Template created successfully');
  };

  const handleUpdateTemplate = async (template: MessageTemplate): Promise<void> => {
    setTemplates(prev => prev.map(t => t.id === template.id ? template : t));
    toast.success('Template updated successfully');
  };

  const handleDeleteTemplate = async (templateId: string): Promise<void> => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    toast.success('Template deleted successfully');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Message Templates</h1>
        <p className="text-muted-foreground">
          Create and manage reusable message templates for your communications
        </p>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <TemplateManager
            templates={templates}
            onSelectTemplate={handleSelectTemplate}
            onCreateTemplate={handleCreateTemplate}
            onUpdateTemplate={handleUpdateTemplate}
            onDeleteTemplate={handleDeleteTemplate}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageTemplates;
