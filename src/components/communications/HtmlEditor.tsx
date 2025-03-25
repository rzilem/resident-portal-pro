
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import EditorToolbar from './editor/EditorToolbar';
import VisualEditor from './editor/VisualEditor';
import HtmlSourceEditor from './editor/HtmlSourceEditor';
import EditorTabs from './editor/EditorTabs';

interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const HtmlEditor: React.FC<HtmlEditorProps> = ({ value, onChange }) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'source'>('visual');

  // Convert useState setter to expected function signature
  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'visual' | 'source');
  };

  // Execute command for the visual editor
  const executeCommand = (command: string, value: string | null = null) => {
    console.log('Execute command:', command, value);
  };

  const createLink = () => {
    console.log('Create link');
  };

  const insertImage = () => {
    console.log('Insert image');
  };

  return (
    <Card className="border overflow-hidden">
      <EditorTabs activeTab={activeTab} onTabChange={handleTabChange} />
      
      <div className="p-0">
        {activeTab === 'visual' && (
          <EditorToolbar 
            executeCommand={executeCommand}
            createLink={createLink}
            insertImage={insertImage}
          />
        )}
        
        {activeTab === 'visual' ? (
          <VisualEditor 
            value={value} 
            onUpdate={onChange} 
          />
        ) : (
          <HtmlSourceEditor 
            value={value} 
            onChange={onChange} 
          />
        )}
      </div>
    </Card>
  );
};

export default HtmlEditor;
