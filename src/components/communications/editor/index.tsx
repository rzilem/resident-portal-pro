
import React, { useState, useRef, forwardRef } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import EditorToolbar from './EditorToolbar';
import VisualEditor, { VisualEditorRef } from './VisualEditor';
import HtmlSourceEditor, { HtmlSourceEditorRef } from './HtmlSourceEditor';
import EditorTabs from './EditorTabs';

export interface HtmlEditorRef {
  insertAtCursor: (text: string) => void;
  getContent: () => string;
  executeCommand: (command: string, value?: string | null) => void;
}

export interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  onSave?: () => void;
  onPreview?: () => void;
  hasUnsavedChanges?: boolean;
}

const HtmlEditor = forwardRef<HtmlEditorRef, HtmlEditorProps>(
  ({ value, onChange, readOnly = false, onSave, onPreview, hasUnsavedChanges = false }, ref) => {
    const [activeTab, setActiveTab] = useState<'visual' | 'html'>('visual');
    const visualEditorRef = useRef<VisualEditorRef>(null);
    const htmlEditorRef = useRef<HtmlSourceEditorRef>(null);
    
    // Execute editor commands
    const executeCommand = (command: string, value: string | null = null) => {
      if (readOnly || activeTab !== "visual") return;
      
      visualEditorRef.current?.executeCommand(command, value);
    };

    const handleToolbarAction = (action: string, value?: string) => {
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
        case 'heading':
          executeCommand('formatBlock', `<h${value}>`);
          break;
        case 'link':
          const url = prompt('Enter link URL:');
          if (url) {
            executeCommand('createLink', url);
          }
          break;
        case 'image':
          const imageUrl = prompt('Enter image URL:');
          if (imageUrl) {
            executeCommand('insertImage', imageUrl);
          }
          break;
        default:
          console.log('Toolbar action:', action);
      }
    };
    
    // Expose methods to parent components
    React.useImperativeHandle(ref, () => ({
      insertAtCursor: (text: string) => {
        if (activeTab === 'visual' && visualEditorRef.current) {
          visualEditorRef.current.insertAtCursor(text);
        } else if (activeTab === 'html' && htmlEditorRef.current) {
          htmlEditorRef.current.insertAtCursor(text);
        }
      },
      getContent: () => value,
      executeCommand
    }));
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (onSave) onSave();
      }
    };
    
    return (
      <div className="border rounded-md overflow-hidden" onKeyDown={handleKeyDown}>
        <EditorTabs 
          activeTab={activeTab} 
          onTabChange={(tab) => setActiveTab(tab as 'visual' | 'html')}
          onSave={onSave}
          hasUnsavedChanges={hasUnsavedChanges}
        >
          <Tabs value={activeTab} className="w-full">
            <TabsContent value="visual" className="m-0 p-0">
              <EditorToolbar 
                disabled={readOnly} 
                onAction={handleToolbarAction}
              />
              <VisualEditor 
                value={value} 
                onUpdate={onChange} 
                readOnly={readOnly}
                ref={visualEditorRef}
              />
            </TabsContent>
            
            <TabsContent value="html" className="m-0 p-0">
              <HtmlSourceEditor 
                value={value} 
                onChange={onChange} 
                readOnly={readOnly}
                ref={htmlEditorRef}
              />
            </TabsContent>
          </Tabs>
        </EditorTabs>
        
        {onPreview && (
          <div className="flex justify-end p-2 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onPreview}
              className="text-sm text-blue-600 hover:underline"
            >
              Preview
            </Button>
          </div>
        )}
      </div>
    );
  }
);

HtmlEditor.displayName = 'HtmlEditor';

// Import Button since we're using it
import { Button } from '@/components/ui/button';

export default HtmlEditor;
