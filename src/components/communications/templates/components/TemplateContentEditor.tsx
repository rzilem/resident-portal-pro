
import React, { useEffect, useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Editor as TinyMCEEditor } from 'tinymce';
import { mergeTagService } from '@/services/mergeTagService';
import { Tag } from 'lucide-react';
import HtmlEditor, { HtmlEditorRef } from '@/components/communications/HtmlEditor';

interface TemplateContentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  subject: string;
  onSubjectChange: (subject: string) => void;
}

const TemplateContentEditor: React.FC<TemplateContentEditorProps> = ({
  content,
  onContentChange,
  subject,
  onSubjectChange
}) => {
  const [activeTab, setActiveTab] = useState<string>('visual');
  const [htmlContent, setHtmlContent] = useState<string>(content);
  const [mergeTags, setMergeTags] = useState<{ tag: string; description: string }[]>([]);
  const editorRef = useRef<HtmlEditorRef | null>(null);

  useEffect(() => {
    // Load merge tags from service
    const loadMergeTags = async () => {
      const tags = await mergeTagService.getMergeTags();
      setMergeTags(tags);
    };
    
    loadMergeTags();
  }, []);

  useEffect(() => {
    setHtmlContent(content);
  }, [content]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    if (value === 'visual' && activeTab === 'html') {
      // When switching from HTML to Visual, update the editor content
      onContentChange(htmlContent);
    }
    
    setActiveTab(value);
  };

  // Handle HTML content change in source mode
  const handleHtmlContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setHtmlContent(newContent);
    onContentChange(newContent);
  };

  // Insert merge tag into content
  const insertMergeTag = (tag: string) => {
    if (activeTab === 'visual' && editorRef.current) {
      // For visual editor
      if (editorRef.current && editorRef.current.insertContent) {
        editorRef.current.insertContent(`{${tag}}`);
      }
    } else {
      // For HTML source editor
      setHtmlContent(prev => {
        const newContent = prev + `{${tag}}`;
        onContentChange(newContent);
        return newContent;
      });
    }
  };

  // Insert merge tag into subject
  const insertMergeTagInSubject = (tag: string) => {
    const newSubject = subject + `{${tag}}`;
    onSubjectChange(newSubject);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="subject">Subject</Label>
        <div className="flex mt-1.5 space-x-2">
          <div className="flex-1">
            <Textarea
              id="subject"
              value={subject}
              onChange={(e) => onSubjectChange(e.target.value)}
              placeholder="Email subject line"
              className="resize-none"
            />
          </div>
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                // Show merge tags dropdown for subject
              }}
            >
              <Tag className="h-4 w-4 mr-1" />
              Insert Tag
            </Button>
          </div>
        </div>
      </div>
      
      <div>
        <Label>Content</Label>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-1.5">
          <div className="flex justify-between items-center mb-2">
            <TabsList>
              <TabsTrigger value="visual">Visual Editor</TabsTrigger>
              <TabsTrigger value="html">HTML Source</TabsTrigger>
            </TabsList>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                // Show merge tags dropdown for content
              }}
            >
              <Tag className="h-4 w-4 mr-1" />
              Insert Tag
            </Button>
          </div>
          
          <TabsContent value="visual" className="mt-0">
            <HtmlEditor
              ref={editorRef as React.RefObject<HtmlEditorRef>}
              value={content}
              onChange={onContentChange}
              height={350}
            />
          </TabsContent>
          
          <TabsContent value="html" className="mt-0">
            <Textarea
              value={htmlContent}
              onChange={handleHtmlContentChange}
              placeholder="Enter HTML content"
              className="min-h-[350px] font-mono text-sm"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TemplateContentEditor;
