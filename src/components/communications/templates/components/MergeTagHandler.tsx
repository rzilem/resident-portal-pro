
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { MergeTag } from '@/types/mergeTags';
import { TemplateFormSetters } from '../types';
import { TemplateContentEditorRef } from './TemplateContentEditor';

export interface MergeTagHandlerProps {
  onInsertTag: (tag: MergeTag) => void;
}

export const useMergeTagInsertion = (
  activeElementRef: React.MutableRefObject<Element | null>,
  contentEditorRef: React.RefObject<TemplateContentEditorRef>,
  setTemplate: TemplateFormSetters,
  template: { subject: string }
) => {
  return (tag: MergeTag) => {
    const activeElement = activeElementRef.current;
    const subjectInput = document.getElementById('template-subject');
    
    // Check if the subject field was active when dialog opened
    if (activeElement === subjectInput) {
      const subjectInputElement = activeElement as HTMLInputElement;
      if (subjectInputElement && typeof subjectInputElement.focus === 'function') {
        const cursorPosition = subjectInputElement.selectionStart || 0;
        const newSubject = template.subject.substring(0, cursorPosition) + 
                          tag.tag + 
                          template.subject.substring(cursorPosition);
        setTemplate.setSubject(newSubject);
        
        // Restore focus and set cursor position after inserted tag
        setTimeout(() => {
          subjectInputElement.focus();
          subjectInputElement.selectionStart = 
          subjectInputElement.selectionEnd = cursorPosition + tag.tag.length;
        }, 0);
      }
    } else {
      // Otherwise insert the tag into the content editor
      if (contentEditorRef.current) {
        contentEditorRef.current.insertTextAtCursor(tag.tag);
      }
    }
  };
};
