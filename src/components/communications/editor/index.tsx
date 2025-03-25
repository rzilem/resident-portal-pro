
import React, { useState } from 'react';
import EditorTabs from './EditorTabs';
import VisualEditor from './VisualEditor';
import HtmlSourceEditor from './HtmlSourceEditor';
import { TabsContent } from '@/components/ui/tabs';

interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const HtmlEditor: React.FC<HtmlEditorProps> = ({ value, onChange }) => {
  const [activeTab, setActiveTab] = useState<string>("visual");
  const [htmlCode, setHtmlCode] = useState<string>(value);

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

  return (
    <div className="border rounded-md overflow-hidden">
      <EditorTabs activeTab={activeTab} onTabChange={handleTabChange}>
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
