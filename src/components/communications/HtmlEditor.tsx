
import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import EditorToolbar from './editor/EditorToolbar';
import VisualEditor from './editor/VisualEditor';
import HtmlSourceEditor from './editor/HtmlSourceEditor';

export interface HtmlEditorRef {
  insertAtCursor: (text: string) => void;
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
    
    // Expose methods to parent components
    useImperativeHandle(ref, () => ({
      insertAtCursor: (text: string) => {
        if (activeTab === 'visual') {
          // Handle insertion in visual editor (implementation depends on editor library)
          console.log('Insert into visual editor:', text);
          
          // This is a simple implementation that appends to the end
          // In a real implementation, you would want to insert at cursor position
          handleChange(htmlContent + text);
        } else {
          // Handle insertion in HTML source editor
          // This is handled in the HtmlSourceEditor component
          console.log('Insert into HTML editor:', text);
          
          // This is a simple implementation that appends to the end
          // In a real implementation, you would want to insert at cursor position
          handleChange(htmlContent + text);
        }
      }
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
            <EditorToolbar disabled={readOnly} onAction={(action) => {
              console.log('Editor action:', action);
              // Implement toolbar actions
            }} />
            <VisualEditor 
              value={htmlContent} 
              onUpdate={handleChange} 
              readOnly={readOnly}
            />
          </TabsContent>
          
          <TabsContent value="html" className="m-0 p-0">
            <HtmlSourceEditor 
              value={htmlContent} 
              onChange={handleChange} 
              readOnly={readOnly}
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
