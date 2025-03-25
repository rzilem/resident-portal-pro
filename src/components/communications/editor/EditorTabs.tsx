
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EditorTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

const EditorTabs: React.FC<EditorTabsProps> = ({ activeTab, onTabChange, children }) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <div className="flex items-center justify-between border-b px-3 py-2">
        <TabsList>
          <TabsTrigger value="visual">Visual</TabsTrigger>
          <TabsTrigger value="html">HTML</TabsTrigger>
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
};

export default EditorTabs;
