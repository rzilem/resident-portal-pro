
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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

  const handleCommunityToggle = (communityId: string) => {
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
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
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
              onNameChange={setTemplate.setName}
              onDescriptionChange={setTemplate.setDescription}
              onSubjectChange={setTemplate.setSubject}
              onCategoryChange={setTemplate.setCategory}
              onMergeTagsClick={() => setIsMergeTagsDialogOpen(true)}
            />
            
            <CommunitiesSelector 
              selectedCommunities={template.communities}
              onToggleCommunity={handleCommunityToggle}
            />
            
            <TemplateContentEditor 
              content={template.content}
              isHtmlFormat={template.isHtmlFormat}
              onContentChange={setTemplate.setContent}
              onFormatChange={setTemplate.setIsHtmlFormat}
              onMergeTagsClick={() => setIsMergeTagsDialogOpen(true)}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={onSave}>
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
