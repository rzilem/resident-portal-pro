
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import HtmlEditor, { HtmlEditorRef } from '@/components/communications/HtmlEditor';
import { mergeTagService } from '@/services/mergeTagService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MergeTag } from '@/types/mergeTags';

export interface TemplateContentEditorProps {
  content: string;
  onContentChange: (value: string) => void;
  onFormatChange?: (value: any) => void;
  onMergeTagsClick: () => void;
  onSaveTemplate: () => void;
  onInsertMergeTag: (tag: MergeTag) => void;
}

export interface TemplateContentEditorRef {
  insertMergeTag: (tag: MergeTag) => void;
  getContent: () => string;
}

const TemplateContentEditor = forwardRef<TemplateContentEditorRef, TemplateContentEditorProps>(
  ({ content, onContentChange, onMergeTagsClick, onSaveTemplate, onInsertMergeTag }, ref) => {
    const editorRef = useRef<HtmlEditorRef>(null);
    const [mergeTags, setMergeTags] = useState<MergeTag[]>([]);
    const [isHtmlFormat, setIsHtmlFormat] = useState(true);

    useEffect(() => {
      const loadMergeTags = async () => {
        try {
          const tags = await mergeTagService.getAllMergeTags();
          setMergeTags(tags);
        } catch (error) {
          console.error('Failed to load merge tags:', error);
        }
      };

      loadMergeTags();
    }, []);

    useImperativeHandle(ref, () => ({
      insertMergeTag: (tag: MergeTag) => {
        if (isHtmlFormat) {
          // Insert tag in HTML editor
          if (editorRef.current) {
            const tagContent = `{{${tag.tag}}}`;
            // Use appropriate method to insert content based on the HtmlEditorRef API
            editorRef.current.setContent(editorRef.current.getContent() + tagContent);
            onInsertMergeTag(tag);
          }
        } else {
          // For plain text, we'll need to handle this differently
          onInsertMergeTag(tag);
        }
      },
      getContent: () => {
        if (isHtmlFormat && editorRef.current) {
          return editorRef.current.getContent();
        }
        return content;
      },
    }));

    const handleFormatToggle = () => {
      setIsHtmlFormat(!isHtmlFormat);
      if (onFormatChange) {
        onFormatChange(!isHtmlFormat);
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleFormatToggle}
            >
              {isHtmlFormat ? 'Switch to Plain Text' : 'Switch to HTML'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={onMergeTagsClick}
            >
              Insert Merge Tag
            </Button>
          </div>
          <Button 
            type="button" 
            onClick={onSaveTemplate}
          >
            Save Template
          </Button>
        </div>

        <div className="min-h-[300px] border rounded-md">
          {isHtmlFormat ? (
            <HtmlEditor
              ref={editorRef}
              value={content}
              onChange={onContentChange}
            />
          ) : (
            <Textarea
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              className="w-full h-[300px] p-2"
            />
          )}
        </div>
      </div>
    );
  }
);

TemplateContentEditor.displayName = 'TemplateContentEditor';

export default TemplateContentEditor;
