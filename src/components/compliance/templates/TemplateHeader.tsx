
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Association } from '@/types/association';

interface TemplateHeaderProps {
  association: Association;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const TemplateHeader = ({ association, activeTab, onTabChange }: TemplateHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-2">CCR Items - {association.name}</h1>
      <div className="text-sm text-muted-foreground mb-4">
        <div>Manager</div>
        <div>William Canales</div>
      </div>
      
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList>
          <TabsTrigger value="association">Association CCR</TabsTrigger>
          <TabsTrigger value="unused">Unused CCR</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TemplateHeader;
