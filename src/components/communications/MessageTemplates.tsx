
import React, { useState } from 'react';
import { toast } from 'sonner';
import { MessageTemplate, MessageTemplatesProps } from './templates/types';
import TemplateEditorDialog from './templates/TemplateEditorDialog';
import TemplatePreviewDialog from './templates/TemplatePreviewDialog';
import TemplatesHeader from './templates/TemplatesHeader';
import TemplatesList from './templates/TemplatesList';
import { useTemplateEditor } from './templates/hooks/useTemplateEditor';

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
  
  const {
    templateForm,
    setTemplateForm,
    resetForm,
    handleCreateTemplate,
    handleEditTemplate,
    setupFormForTemplate
  } = useTemplateEditor(onCreateTemplate, onUpdateTemplate);

  const handleCreateTemplateClick = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const handleSaveCreate = () => {
    if (handleCreateTemplate()) {
      setIsCreateDialogOpen(false);
    }
  };

  const handleSaveEdit = () => {
    if (handleEditTemplate(selectedTemplate)) {
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteTemplate = (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    
    onDeleteTemplate(id);
    toast.success('Template deleted');
  };

  const openEditDialog = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setupFormForTemplate(template);
    setIsEditDialogOpen(true);
  };

  const openPreviewDialog = (template: MessageTemplate) => {
    setPreviewTemplate(template);
    setIsPreviewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <TemplatesHeader onCreateClick={handleCreateTemplateClick} />
      
      <TemplatesList 
        templates={templates}
        onSelectTemplate={onSelectTemplate}
        onEditTemplate={openEditDialog}
        onDeleteTemplate={onDeleteTemplate}
        onCreateTemplate={handleCreateTemplateClick}
        onPreview={openPreviewDialog}
        onEdit={openEditDialog}
        onDelete={handleDeleteTemplate}
        onSelect={onSelectTemplate}
      />

      {/* Template Editor Dialog - Create */}
      <TemplateEditorDialog
        type="create"
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSave={handleSaveCreate}
        template={templateForm}
        setTemplate={setTemplateForm}
      />

      {/* Template Editor Dialog - Edit */}
      <TemplateEditorDialog
        type="edit"
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSaveEdit}
        template={templateForm}
        setTemplate={setTemplateForm}
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
