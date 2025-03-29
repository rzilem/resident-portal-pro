
import { useState, useRef } from 'react';
import { TemplateFormState, TemplateFormSetters } from '../types';

export function useTemplateDialogState(
  template: TemplateFormState,
  setTemplate: TemplateFormSetters,
  onClose: () => void,
  onSave: () => void,
  type: 'create' | 'edit'
) {
  const [isMergeTagsDialogOpen, setIsMergeTagsDialogOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialTemplate, setInitialTemplate] = useState<TemplateFormState | null>(null);
  const activeElementRef = useRef<Element | null>(null);

  // Track changes when the dialog opens or template changes
  const trackChanges = () => {
    if (!initialTemplate) {
      setInitialTemplate({ ...template });
      setHasUnsavedChanges(false);
    }
  };

  // Reset state
  const resetState = () => {
    setInitialTemplate(null);
    setHasUnsavedChanges(false);
  };

  // Save the active element when the merge tags dialog opens
  const handleOpenMergeTagsDialog = () => {
    activeElementRef.current = document.activeElement;
    setIsMergeTagsDialogOpen(true);
  };

  // Check for unsaved changes before closing
  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
        resetState();
      }
    } else {
      onClose();
      resetState();
    }
  };

  const handleValueChange = (setter: (value: any) => void, value: any) => {
    setHasUnsavedChanges(true);
    setter(value);
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

  const handleSaveTemplate = () => {
    if (!template.name.trim()) {
      return { success: false, message: 'Please enter a template name' };
    }

    if (!template.subject.trim()) {
      return { success: false, message: 'Please enter a subject line' };
    }

    if (!template.content.trim()) {
      return { success: false, message: 'Please enter template content' };
    }

    onSave();
    setHasUnsavedChanges(false);
    setInitialTemplate({ ...template });
    return { success: true, message: '' };
  };

  return {
    state: {
      isMergeTagsDialogOpen,
      hasUnsavedChanges,
      initialTemplate,
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
  };
}
