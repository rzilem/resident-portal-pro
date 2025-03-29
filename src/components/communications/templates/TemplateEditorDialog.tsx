
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import MergeTagsDialog from '../MergeTagsDialog';
import { TemplateFormState, TemplateFormSetters } from './types';
import { MergeTag } from '@/types/mergeTags';
import TemplateFormFields from './components/TemplateFormFields';
import CommunitiesSelector from './components/CommunitiesSelector';
import TemplateContentEditor from './components/TemplateContentEditor';

interface TemplateEditorDialogProps {
  type: 'create' | 'edit';
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  template: TemplateFormState;
  setTemplate: TemplateFormSetters;
}

const TemplateEditorDialog: React.FC<TemplateEditorDialogProps> = ({
  type,
  isOpen,
  onClose,
  onSave,
  template,
  setTemplate
}) => {
  const [isMergeTagsDialogOpen, setIsMergeTagsDialogOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialTemplate, setInitialTemplate] = useState<TemplateFormState | null>(null);

  // Track changes when the dialog opens or template changes
  useEffect(() => {
    if (isOpen && !initialTemplate) {
      setInitialTemplate({ ...template });
      setHasUnsavedChanges(false);
    }
  }, [isOpen, template, initialTemplate]);

  // Check for unsaved changes before closing
  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
        setInitialTemplate(null);
        setHasUnsavedChanges(false);
      }
    } else {
      onClose();
      setInitialTemplate(null);
    }
  };

  const handleCommunityToggle = (communityId: string) => {
    setHasUnsavedChanges(true);
    setTemplate.setCommunities(prev => {
      if (communityId === 'all') {
        return ['all'];
      }
      
      if (prev.includes('all') && communityId !== 'all') {
        return [communityId];
      }
      
      const newSelection = prev.includes(communityId)
        ? prev.filter(id => id !== communityId)
        : [...prev, communityId];
        
      return newSelection.length === 0 ? ['all'] : newSelection;
    });
  };

  const handleNameChange = (name: string) => {
    setHasUnsavedChanges(true);
    setTemplate.setName(name);
  };

  const handleDescriptionChange = (description: string) => {
    setHasUnsavedChanges(true);
    setTemplate.setDescription(description);
  };

  const handleSubjectChange = (subject: string) => {
    setHasUnsavedChanges(true);
    setTemplate.setSubject(subject);
  };

  const handleCategoryChange = (category: string) => {
    setHasUnsavedChanges(true);
    setTemplate.setCategory(category);
  };

  const handleContentChange = (content: string) => {
    setHasUnsavedChanges(true);
    setTemplate.setContent(content);
  };

  const handleFormatChange = (isHtml: boolean) => {
    setHasUnsavedChanges(true);
    setTemplate.setIsHtmlFormat(isHtml);
  };

  const handleSaveTemplate = () => {
    if (!template.name.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    if (!template.subject.trim()) {
      toast.error('Please enter a subject line');
      return;
    }

    if (!template.content.trim()) {
      toast.error('Please enter template content');
      return;
    }

    onSave();
    setHasUnsavedChanges(false);
    setInitialTemplate({ ...template });
  };

  const handleInsertMergeTag = (tag: MergeTag) => {
    const activeElement = document.activeElement;
    const subjectInput = document.getElementById('template-subject');
    
    if (activeElement === subjectInput) {
      const cursorPosition = (activeElement as HTMLInputElement).selectionStart || 0;
      const newSubject = template.subject.substring(0, cursorPosition) + 
                          tag.tag + 
                          template.subject.substring(cursorPosition);
      setTemplate.setSubject(newSubject);
    } else {
      setTemplate.setContent(template.content + ' ' + tag.tag + ' ');
    }
    setIsMergeTagsDialogOpen(false);
    setHasUnsavedChanges(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto bg-background">
          <DialogHeader>
            <DialogTitle>{type === 'create' ? 'Create New Template' : 'Edit Template'}</DialogTitle>
            <DialogDescription>
              Create reusable message templates with merge tags for personalized communications.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <TemplateFormFields 
              name={template.name}
              description={template.description}
              subject={template.subject}
              category={template.category}
              onNameChange={handleNameChange}
              onDescriptionChange={handleDescriptionChange}
              onSubjectChange={handleSubjectChange}
              onCategoryChange={handleCategoryChange}
              onMergeTagsClick={() => setIsMergeTagsDialogOpen(true)}
            />
            
            <CommunitiesSelector 
              selectedCommunities={template.communities}
              onToggleCommunity={handleCommunityToggle}
            />
            
            <TemplateContentEditor 
              content={template.content}
              isHtmlFormat={template.isHtmlFormat}
              onContentChange={handleContentChange}
              onFormatChange={handleFormatChange}
              onMergeTagsClick={() => setIsMergeTagsDialogOpen(true)}
              onSaveTemplate={handleSaveTemplate}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            <Button 
              onClick={handleSaveTemplate}
              disabled={!hasUnsavedChanges}
            >
              {type === 'create' ? 'Create Template' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <MergeTagsDialog
        open={isMergeTagsDialogOpen}
        onOpenChange={setIsMergeTagsDialogOpen}
        onSelectTag={handleInsertMergeTag}
      />
    </>
  );
};

export default TemplateEditorDialog;
