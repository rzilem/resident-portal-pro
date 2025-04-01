
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Eye, Code, Save, Tags } from 'lucide-react';
import { MergeTag } from '@/types/mergeTags';

export interface TemplateContentEditorRef {
  insertTextAtCursor: (text: string) => void;
  getSelectionPosition: () => { start: number; end: number } | null;
}

export interface TemplateContentEditorProps {
  content: string;
  onContentChange: (value: string) => void;
  isHtmlEnabled: boolean;
  onHtmlToggle?: (value: boolean) => void;
  onMergeTagsClick: () => void;
  onSaveTemplate: () => void;
  onInsertMergeTag: (tag: MergeTag) => void;
}

const TemplateContentEditor = forwardRef<TemplateContentEditorRef, TemplateContentEditorProps>(
  ({ 
    content, 
    onContentChange, 
    isHtmlEnabled, 
    onHtmlToggle,
    onMergeTagsClick, 
    onSaveTemplate,
    onInsertMergeTag
  }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      insertTextAtCursor: (text: string) => {
        if (textareaRef.current) {
          const textarea = textareaRef.current;
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          
          const beforeText = textarea.value.substring(0, start);
          const afterText = textarea.value.substring(end);
          
          const newText = beforeText + text + afterText;
          onContentChange(newText);
          
          // Reset cursor position after update
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + text.length, start + text.length);
          }, 0);
        }
      },
      getSelectionPosition: () => {
        if (textareaRef.current) {
          return {
            start: textareaRef.current.selectionStart,
            end: textareaRef.current.selectionEnd
          };
        }
        return null;
      }
    }));

    return (
      <div className="space-y-2">
        <div className="flex justify-between">
          <Tabs 
            defaultValue={isHtmlEnabled ? "html" : "plain"} 
            className="w-full"
            onValueChange={(value) => onHtmlToggle && onHtmlToggle(value === "html")}
          >
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="html" disabled={!isHtmlEnabled}>
                  <Code className="h-4 w-4 mr-2" />
                  HTML
                </TabsTrigger>
                <TabsTrigger value="plain">
                  <div className="flex items-center">
                    <span className="mr-2">T</span>
                    Plain Text
                  </div>
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onMergeTagsClick}
                >
                  <Tags className="h-4 w-4 mr-2" />
                  Insert Merge Tag
                </Button>

                <Button 
                  type="button"
                  size="sm"
                  onClick={onSaveTemplate}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </Button>
              </div>
            </div>

            <TabsContent value="html" className="p-0 border-0">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                className="w-full h-64 p-3 border rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Enter HTML content here..."
              />
            </TabsContent>

            <TabsContent value="plain" className="p-0 border-0">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                className="w-full h-64 p-3 border rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Enter plain text content here..."
              />
            </TabsContent>

            <TabsContent value="preview" className="p-0 border-0">
              <div
                ref={previewRef}
                className="w-full h-64 p-3 border rounded-md bg-white overflow-auto"
                dangerouslySetInnerHTML={{ __html: isHtmlEnabled ? content : content.replace(/\n/g, '<br/>') }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }
);

TemplateContentEditor.displayName = "TemplateContentEditor";

export default TemplateContentEditor;
