
import { useState } from 'react';

// Hook to handle dialog state
export const useDialogState = () => {
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isMergeTagsDialogOpen, setIsMergeTagsDialogOpen] = useState(false);
  const [showMergeTagPreview, setShowMergeTagPreview] = useState(false);

  return {
    isAiAssistantOpen,
    setIsAiAssistantOpen,
    isMergeTagsDialogOpen,
    setIsMergeTagsDialogOpen,
    showMergeTagPreview,
    setShowMergeTagPreview,
  };
};

// Template utility functions
export const filterTemplatesByCommunity = (templates: any[], communityId: string) => {
  return templates.filter(template => 
    !template.communities || 
    template.communities.includes('all') || 
    template.communities.includes(communityId)
  );
};

// String content manipulation helpers
export const appendToContent = (content: string, textToAdd: string): string => {
  return content + textToAdd;
};

export const insertAtCursor = (content: string, textToInsert: string, cursorPosition: number): string => {
  return content.substring(0, cursorPosition) + textToInsert + content.substring(cursorPosition);
};
