
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
