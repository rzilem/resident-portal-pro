import React, { useState, useImperativeHandle, forwardRef, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import EditorToolbar from './editor/EditorToolbar';
import VisualEditor, { VisualEditorRef } from './editor/VisualEditor';
import HtmlSourceEditor, { HtmlSourceEditorRef } from './editor/HtmlSourceEditor';

export interface HtmlEditorRef {
  insertAtCursor: (text: string) => void;
  getContent: () => string;
}

export interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  onSave?: () => void;
  onPreview?: () => void;
  isTemplate?: boolean;
}

const HtmlEditor = forwardRef<HtmlEditorRef, HtmlEditorProps>(
  ({ value, onChange, readOnly = false, onSave, onPreview, isTemplate }, ref) => {
    const [activeTab, setActiveTab] = useState<string>('visual');
    const [htmlContent, setHtmlContent] = useState<string>(value);
    const visualEditorRef = useRef<VisualEditorRef>(null);
    const htmlEditorRef = useRef<HtmlSourceEditorRef>(null);
    
    // Update local state when prop value changes
    React.useEffect(() => {
      setHtmlContent(value);
    }, [value]);
    
    // Update parent state when local state changes
    const handleChange = (newContent: string) => {
      setHtmlContent(newContent);
      onChange(newContent);
    };
    
    // Handle keyboard shortcuts
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (onSave) onSave();
      }
    };
    
    // Execute editor commands
    const executeCommand = (command: string, value: string | null = null) => {
      if (readOnly || activeTab !== "visual") return;
      
      visualEditorRef.current?.executeCommand(command, value);
    };

    const handleToolbarAction = (action: string) => {
      if (readOnly || activeTab !== "visual") return;
      
      switch (action) {
        case 'bold':
          executeCommand('bold', null);
          break;
        case 'italic':
          executeCommand('italic', null);
          break;
        case 'underline':
          executeCommand('underline', null);
          break;
        case 'bulletList':
          executeCommand('insertUnorderedList', null);
          break;
        case 'orderedList':
          executeCommand('insertOrderedList', null);
          break;
        default:
          console.log('Toolbar action:', action);
      }
    };
    
    // Expose methods to parent components
    useImperativeHandle(ref, () => ({
      insertAtCursor: (text: string) => {
        if (activeTab === 'visual' && visualEditorRef.current) {
          visualEditorRef.current.insertAtCursor(text);
        } else if (activeTab === 'html' && htmlEditorRef.current) {
          htmlEditorRef.current.insertAtCursor(text);
        } else {
          handleChange(htmlContent + text);
        }
      },
      getContent: () => activeTab === 'visual' ? value : htmlContent
    }));
    
    return (
      <div className="border rounded-md overflow-hidden" onKeyDown={handleKeyDown}>
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex items-center justify-between border-b bg-muted/50 px-3">
            <TabsList className="h-10">
              <TabsTrigger value="visual" disabled={readOnly}>Visual</TabsTrigger>
              <TabsTrigger value="html" disabled={readOnly}>HTML</TabsTrigger>
            </TabsList>
            {onSave && !readOnly && (
              <Button 
                size="sm" 
                onClick={onSave}
                className="h-7 text-xs"
              >
                Save
              </Button>
            )}
          </div>
          
          <TabsContent value="visual" className="m-0 p-0">
            <EditorToolbar 
              disabled={readOnly} 
              onAction={handleToolbarAction}
            />
            <VisualEditor 
              value={htmlContent} 
              onUpdate={handleChange} 
              readOnly={readOnly}
              ref={visualEditorRef}
            />
          </TabsContent>
          
          <TabsContent value="html" className="m-0 p-0">
            <HtmlSourceEditor 
              value={htmlContent} 
              onChange={handleChange} 
              readOnly={readOnly}
              ref={htmlEditorRef}
            />
          </TabsContent>
        </Tabs>
        
        {onPreview && (
          <div className="flex justify-end p-2 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onPreview}
              className="text-sm text-blue-600 hover:underline"
            >
              Preview with merge tags
            </Button>
          </div>
        )}
      </div>
    );
  }
);

HtmlEditor.displayName = 'HtmlEditor';

export default HtmlEditor;
