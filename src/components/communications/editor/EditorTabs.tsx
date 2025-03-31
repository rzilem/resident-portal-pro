
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface EditorTabsProps {
  activeTab: 'visual' | 'html';
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
  onSave?: () => void;
  hasUnsavedChanges?: boolean;
}

const EditorTabs: React.FC<EditorTabsProps> = ({
  activeTab,
  onTabChange,
  children,
  onSave,
  hasUnsavedChanges
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="flex justify-between items-center border-b px-2 py-1">
        <TabsList>
          <TabsTrigger value="visual">Visual</TabsTrigger>
          <TabsTrigger value="html">HTML</TabsTrigger>
        </TabsList>
        
        {onSave && (
          <Button 
            size="sm" 
            onClick={onSave}
            disabled={!hasUnsavedChanges}
            className="h-8 gap-1"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
        )}
      </div>
      
      {children}
    </Tabs>
  );
};

export default EditorTabs;
