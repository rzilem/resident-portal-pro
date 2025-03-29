
import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import MergeTagsDialog from '../MergeTagsDialog';
import { TemplateFormState, TemplateFormSetters } from './types';
import { MergeTag } from '@/types/mergeTags';
import TemplateFormFields from './components/TemplateFormFields';
import CommunitiesSelector from './components/CommunitiesSelector';
import TemplateContentEditor, { TemplateContentEditorRef } from './components/TemplateContentEditor';
import TemplateDialogFooter from './components/TemplateDialogFooter';
import { useTemplateDialogState } from './hooks/useTemplateDialogState';
import { useMergeTagInsertion } from './components/MergeTagHandler';

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
  const contentEditorRef = useRef<TemplateContentEditorRef>(null);
  
  const {
    state: {
      isMergeTagsDialogOpen,
      hasUnsavedChanges,
      activeElementRef
    },
    actions: {
      setIsMergeTagsDialogOpen,
      handleOpenMergeTagsDialog,
      handleClose,
      handleCommunityToggle,
      handleSaveTemplate,
      trackChanges,
      handleValueChange
    }
  } = useTemplateDialogState(template, setTemplate, onClose, onSave, type);

  // Track changes when dialog opens
  useEffect(() => {
    if (isOpen) {
      trackChanges();
    }
  }, [isOpen]);

  const handleInsertMergeTag = useMergeTagInsertion(
    activeElementRef,
    contentEditorRef,
    setTemplate,
    template
  );

  const handleSave = () => {
    const result = handleSaveTemplate();
    if (!result.success) {
      toast.error(result.message);
      return;
    }
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
              onNameChange={(value) => handleValueChange(setTemplate.setName, value)}
              onDescriptionChange={(value) => handleValueChange(setTemplate.setDescription, value)}
              onSubjectChange={(value) => handleValueChange(setTemplate.setSubject, value)}
              onCategoryChange={(value) => handleValueChange(setTemplate.setCategory, value)}
              onMergeTagsClick={handleOpenMergeTagsDialog}
            />
            
            <CommunitiesSelector 
              selectedCommunities={template.communities}
              onToggleCommunity={handleCommunityToggle}
            />
            
            <TemplateContentEditor 
              content={template.content}
              isHtmlFormat={template.isHtmlFormat}
              onContentChange={(value) => handleValueChange(setTemplate.setContent, value)}
              onFormatChange={(value) => handleValueChange(setTemplate.setIsHtmlFormat, value)}
              onMergeTagsClick={handleOpenMergeTagsDialog}
              onSaveTemplate={handleSave}
              onInsertMergeTag={handleInsertMergeTag}
              ref={contentEditorRef}
            />
          </div>
          
          <TemplateDialogFooter
            onClose={handleClose}
            onSave={handleSave}
            hasUnsavedChanges={hasUnsavedChanges}
            type={type}
          />
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
