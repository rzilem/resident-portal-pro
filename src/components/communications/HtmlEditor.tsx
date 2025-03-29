
import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import EditorToolbar from './editor/EditorToolbar';
import VisualEditor from './editor/VisualEditor';
import HtmlSourceEditor from './editor/HtmlSourceEditor';
import EditorTabs from './editor/EditorTabs';
import { TabsContent } from '@/components/ui/tabs';

interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const HtmlEditor: React.FC<HtmlEditorProps> = ({ value, onChange }) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'html'>('visual');
  const editorRef = useRef<HTMLDivElement | null>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'visual' | 'html');
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
            onChange(editorElement.innerHTML);
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
      <EditorTabs activeTab={activeTab} onTabChange={handleTabChange}>
        {activeTab === 'visual' && (
          <EditorToolbar 
            executeCommand={executeCommand}
            createLink={createLink}
            insertImage={insertImage}
          />
        )}
        <TabsContent value="visual" className="p-0">
          <VisualEditor 
            value={value} 
            onUpdate={onChange} 
          />
        </TabsContent>
        
        <TabsContent value="html" className="p-0">
          <HtmlSourceEditor 
            value={value} 
            onChange={onChange} 
          />
        </TabsContent>
      </EditorTabs>
    </Card>
  );
};

export default HtmlEditor;
