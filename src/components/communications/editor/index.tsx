
import React, { useState, useRef } from 'react';
import EditorTabs from './EditorTabs';
import VisualEditor from './VisualEditor';
import HtmlSourceEditor from './HtmlSourceEditor';
import EditorToolbar from './EditorToolbar';
import { TabsContent } from '@/components/ui/tabs';

interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const HtmlEditor: React.FC<HtmlEditorProps> = ({ value, onChange }) => {
  const [activeTab, setActiveTab] = useState<string>("visual");
  const [htmlCode, setHtmlCode] = useState<string>(value);
  const editorRef = useRef<HTMLDivElement | null>(null);

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
    onChange(content);
    setHtmlCode(content);
  };

  const handleHtmlUpdate = (content: string) => {
    setHtmlCode(content);
  };

  const executeCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
    // After the command is executed, we need to get the updated content
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const createLink = () => {
    const url = prompt('Enter link URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      executeCommand('insertImage', url);
    }
  };

  // Get a reference to the editor from the VisualEditor component
  const setEditorRef = (el: HTMLDivElement | null) => {
    editorRef.current = el;
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <EditorTabs activeTab={activeTab} onTabChange={handleTabChange}>
        {activeTab === "visual" && (
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
          />
        </TabsContent>

        <TabsContent value="html" className="p-0">
          <HtmlSourceEditor 
            value={htmlCode} 
            onChange={handleHtmlUpdate} 
          />
        </TabsContent>
      </EditorTabs>
    </div>
  );
};

export default HtmlEditor;
