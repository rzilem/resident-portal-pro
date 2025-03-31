
import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import EditorTabs from './EditorTabs';
import VisualEditor, { VisualEditorRef } from './VisualEditor';
import HtmlSourceEditor, { HtmlSourceEditorRef } from './HtmlSourceEditor';
import EditorToolbar from './EditorToolbar';
import { TabsContent } from '@/components/ui/tabs';

export interface HtmlEditorRef {
  insertAtCursor: (text: string) => void;
}

interface HtmlEditorProps {
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
        // Switching from visual to HTML - update the HTML code
        setHtmlCode(value);
      } else if (activeTab === "html" && tab === "visual") {
        // Switching from HTML to visual - update the editor
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
      if (readOnly) return;
      
      document.execCommand(command, false, value);
      // After the command is executed, we need to get the updated content
      const editorElement = document.querySelector('[contenteditable=true]');
      if (editorElement) {
        onChange(editorElement.innerHTML);
      }
    };

    const createLink = () => {
      if (readOnly) return;
      
      const url = prompt('Enter link URL:');
      if (url) {
        executeCommand('createLink', url);
      }
    };

    const insertImage = () => {
      if (readOnly) return;
      
      const url = prompt('Enter image URL:');
      if (url) {
        executeCommand('insertImage', url);
      }
    };

    // Expose method to parent component to insert at cursor
    useImperativeHandle(ref, () => ({
      insertAtCursor: (text: string) => {
        if (activeTab === "visual" && visualEditorRef.current) {
          visualEditorRef.current.insertAtCursor(text);
        } else if (activeTab === "html" && htmlEditorRef.current) {
          htmlEditorRef.current.insertAtCursor(text);
        } else {
          // Fallback: append to the end
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
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          onSave={onSave}
          hasUnsavedChanges={true}
        >
          {activeTab === "visual" && !readOnly && (
            <EditorToolbar 
              executeCommand={executeCommand}
              createLink={createLink}
              insertImage={insertImage}
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
            <button 
              className="text-sm text-blue-600 hover:underline" 
              onClick={onPreview}
            >
              Preview with merge tags
            </button>
          </div>
        )}
      </div>
    );
  }
);

HtmlEditor.displayName = 'HtmlEditor';

export default HtmlEditor;
