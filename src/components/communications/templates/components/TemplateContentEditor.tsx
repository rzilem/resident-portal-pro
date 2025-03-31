
import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import HtmlEditor from '../../editor';
import type { HtmlEditorRef } from '../../HtmlEditor';
import FormatSelector from '../../composer/FormatSelector';
import { Tags } from 'lucide-react';
import { MergeTag } from '@/types/mergeTags';

export interface TemplateContentEditorRef {
  insertAtCursor: (text: string) => void;
}

interface TemplateContentEditorProps {
  content: string;
  isHtmlFormat: boolean;
  onContentChange: (content: string) => void;
  onFormatChange: (isHtml: boolean) => void;
  onMergeTagsClick: () => void;
  onSaveTemplate?: () => void;
  onInsertMergeTag?: (tag: MergeTag) => void;
}

const TemplateContentEditor = forwardRef<TemplateContentEditorRef, TemplateContentEditorProps>(({
  content,
  isHtmlFormat,
  onContentChange,
  onFormatChange,
  onMergeTagsClick,
  onSaveTemplate,
  onInsertMergeTag
}, ref) => {
  const htmlEditorRef = useRef<HtmlEditorRef>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle merge tag insertion
  const handleInsertMergeTag = (tag: MergeTag) => {
    if (onInsertMergeTag) {
      onInsertMergeTag(tag);
    }
  };

  // Expose method to parent component to insert at cursor
  useImperativeHandle(ref, () => ({
    insertAtCursor: (text: string) => {
      if (isHtmlFormat && htmlEditorRef.current) {
        htmlEditorRef.current.insertAtCursor(text);
      } else if (!isHtmlFormat && textareaRef.current) {
        const textarea = textareaRef.current;
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        
        // Insert the text at the cursor position
        const newValue = content.substring(0, startPos) + text + content.substring(endPos);
        onContentChange(newValue);
        
        // Set the cursor position after the inserted text
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = startPos + text.length;
        }, 0);
      }
    }
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div className="flex items-center gap-2">
          <FormatSelector 
            format={isHtmlFormat ? 'html' : 'plain'} 
            onChange={(format) => onFormatChange(format === 'html')}
          />
          
          <Button 
            type="button" 
            size="sm" 
            variant="outline" 
            onClick={onMergeTagsClick}
            className="flex items-center gap-1"
          >
            <Tags className="h-4 w-4" />
            Insert Merge Tags
          </Button>
        </div>
      </div>
      
      {isHtmlFormat ? (
        <HtmlEditor 
          value={content} 
          onChange={onContentChange}
          onSave={onSaveTemplate}
          ref={htmlEditorRef}
          isTemplate={true}
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="w-full min-h-[250px] p-4 border rounded-md"
          placeholder="Enter template content here..."
        />
      )}
    </div>
  );
});

TemplateContentEditor.displayName = 'TemplateContentEditor';

export default TemplateContentEditor;
