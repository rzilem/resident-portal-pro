import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import EditorTabs from './EditorTabs';
import VisualEditor, { VisualEditorRef } from './VisualEditor';
import HtmlSourceEditor, { HtmlSourceEditorRef } from './HtmlSourceEditor';
import EditorToolbar from './EditorToolbar';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

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
    const [activeTab, setActiveTab] = useState<string>("visual");
    const [htmlCode, setHtmlCode] = useState<string>(value);
    const visualEditorRef = useRef<VisualEditorRef>(null);
    const htmlEditorRef = useRef<HtmlSourceEditorRef>(null);

    const handleTabChange = (tab: string) => {
      if (activeTab === "visual" && tab === "html") {
        setHtmlCode(value);
      } else if (activeTab === "html" && tab === "visual") {
        onChange(htmlCode);
      }
      setActiveTab(tab);
    };

    const handleVisualUpdate = (content: string) => {
      if (!readOnly) {
        onChange(content);
        setHtmlCode(content);
      }
    };

    const handleHtmlUpdate = (content: string) => {
      if (!readOnly) {
        setHtmlCode(content);
      }
    };

    const executeCommand = (command: string, value: string | null = null) => {
      if (readOnly || activeTab !== "visual") return;
      
      visualEditorRef.current?.executeCommand(command, value);
    };

    const createLink = () => {
      if (readOnly || activeTab !== "visual") return;
      
      const url = prompt('Enter link URL:');
      if (url) {
        executeCommand('createLink', url);
      }
    };

    const insertImage = () => {
      if (readOnly || activeTab !== "visual") return;
      
      const url = prompt('Enter image URL:');
      if (url) {
        executeCommand('insertImage', url);
      }
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
        case 'link':
          createLink();
          break;
        case 'image':
          insertImage();
          break;
        case 'alignLeft':
          executeCommand('justifyLeft', null);
          break;
        case 'alignCenter':
          executeCommand('justifyCenter', null);
          break;
        case 'alignRight':
          executeCommand('justifyRight', null);
          break;
        default:
          console.log('Unhandled action:', action);
      }
    };

    useImperativeHandle(ref, () => ({
      insertAtCursor: (text: string) => {
        if (activeTab === "visual" && visualEditorRef.current) {
          visualEditorRef.current.insertAtCursor(text);
        } else if (activeTab === "html" && htmlEditorRef.current) {
          htmlEditorRef.current.insertAtCursor(text);
        } else {
          if (activeTab === "visual") {
            handleVisualUpdate(value + text);
          } else {
            handleHtmlUpdate(htmlCode + text);
          }
        }
      }
    }));

    return (
      <div className="border rounded-md overflow-hidden">
        <EditorTabs 
          activeTab={activeTab as 'visual' | 'html'} 
          onTabChange={handleTabChange}
          onSave={onSave}
          hasUnsavedChanges={true}
        >
          {activeTab === "visual" && !readOnly && (
            <EditorToolbar 
              onAction={handleToolbarAction}
              disabled={readOnly}
            />
          )}
          
          <TabsContent value="visual" className="p-0">
            <VisualEditor 
              value={value} 
              onUpdate={handleVisualUpdate} 
              readOnly={readOnly}
              ref={visualEditorRef}
            />
          </TabsContent>

          <TabsContent value="html" className="p-0">
            <HtmlSourceEditor 
              value={htmlCode} 
              onChange={handleHtmlUpdate} 
              readOnly={readOnly}
              ref={htmlEditorRef}
            />
          </TabsContent>
        </EditorTabs>
        
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
