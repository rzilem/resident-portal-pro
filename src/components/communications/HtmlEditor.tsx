
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import EditorToolbar from './editor/EditorToolbar';
import VisualEditor from './editor/VisualEditor';
import HtmlSourceEditor from './editor/HtmlSourceEditor';
import EditorTabs from './editor/EditorTabs';
import { TabsContent } from '@/components/ui/tabs';

interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave?: () => void;
  isTemplate?: boolean;
}

const HtmlEditor: React.FC<HtmlEditorProps> = ({ 
  value, 
  onChange, 
  onSave,
  isTemplate = false 
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'html'>('visual');
  const [currentContent, setCurrentContent] = useState<string>(value);
  const lastSavedContent = useRef<string>(value);
  const hasUnsavedChanges = currentContent !== lastSavedContent.current;

  // Update content when value prop changes (from parent)
  useEffect(() => {
    setCurrentContent(value);
    lastSavedContent.current = value;
  }, [value]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'visual' | 'html');
  };

  const handleContentChange = (newContent: string) => {
    setCurrentContent(newContent);
    onChange(newContent);
  };

  const handleSaveContent = () => {
    if (onSave) {
      lastSavedContent.current = currentContent;
      onSave();
      
      // Show save confirmation
      toast.success(isTemplate ? "Template saved successfully" : "Content saved successfully");
    }
  };

  // Execute document command function
  const executeCommand = (command: string, value: string | null = null) => {
    if (activeTab === 'visual') {
      document.execCommand(command, false, value);
      
      // Get the updated content after command execution
      if (document.activeElement instanceof HTMLElement) {
        // Let the input event handler handle the update
        setTimeout(() => {
          const editorElement = document.querySelector('[contenteditable=true]');
          if (editorElement) {
            handleContentChange(editorElement.innerHTML);
          }
        }, 0);
      }
    }
  };

  // Function to create a link
  const createLink = () => {
    const url = prompt('Enter link URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  // Function to insert image
  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      executeCommand('insertImage', url);
    }
  };

  return (
    <Card className="border overflow-hidden">
      <EditorTabs 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        onSave={onSave ? handleSaveContent : undefined}
        hasUnsavedChanges={hasUnsavedChanges}
      >
        {activeTab === 'visual' && (
          <EditorToolbar 
            executeCommand={executeCommand}
            createLink={createLink}
            insertImage={insertImage}
          />
        )}
        <TabsContent value="visual" className="p-0">
          <VisualEditor 
            value={currentContent} 
            onUpdate={handleContentChange} 
          />
        </TabsContent>
        
        <TabsContent value="html" className="p-0">
          <HtmlSourceEditor 
            value={currentContent} 
            onChange={handleContentChange} 
          />
        </TabsContent>
      </EditorTabs>
    </Card>
  );
};

export default HtmlEditor;
