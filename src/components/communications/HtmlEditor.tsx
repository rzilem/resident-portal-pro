
import React from 'react';
import { Card } from '@/components/ui/card';
import EditorToolbar from './editor/EditorToolbar';
import VisualEditor from './editor/VisualEditor';
import HtmlSourceEditor from './editor/HtmlSourceEditor';
import EditorTabs from './editor/EditorTabs';
import { useState } from 'react';

interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const HtmlEditor: React.FC<HtmlEditorProps> = ({ value, onChange }) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'source'>('visual');

  return (
    <Card className="border overflow-hidden">
      <EditorTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="p-0">
        <EditorToolbar 
          onAction={(action) => {
            // Handle editor actions like bold, italic, etc.
            console.log('Editor action:', action);
          }}
          disabled={activeTab === 'source'}
        />
        
        {activeTab === 'visual' ? (
          <VisualEditor 
            value={value} 
            onChange={onChange} 
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
