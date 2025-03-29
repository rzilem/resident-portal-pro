
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface EditorTabsProps {
  activeTab: string;
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
  hasUnsavedChanges = false
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <TabsList>
          <TabsTrigger value="visual">Visual</TabsTrigger>
          <TabsTrigger value="html">HTML</TabsTrigger>
        </TabsList>
        
        {onSave && (
          <Button 
            size="sm" 
            onClick={onSave}
            disabled={!hasUnsavedChanges}
            variant={hasUnsavedChanges ? "default" : "outline"}
            className="gap-1"
          >
            <Save size={16} />
            {hasUnsavedChanges ? "Save Changes" : "Saved"}
          </Button>
        )}
      </div>
      {children}
    </Tabs>
  );
};

export default EditorTabs;
