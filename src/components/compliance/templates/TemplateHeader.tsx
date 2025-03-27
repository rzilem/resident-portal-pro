
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getViolationGroupsByAssociation } from '@/data/violationTemplates';

interface TemplateHeaderProps {
  associationId: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TemplateHeader: React.FC<TemplateHeaderProps> = ({ 
  associationId, 
  activeTab, 
  onTabChange 
}) => {
  // Get violation groups for the selected association
  const groups = getViolationGroupsByAssociation(associationId);
  
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-1">Violation Templates</h2>
        <p className="text-sm text-muted-foreground">
          Create and manage templates for common violations
        </p>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={onTabChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="association">Association Templates</TabsTrigger>
          <TabsTrigger value="unused">Unused Templates</TabsTrigger>
          <TabsTrigger value="community">Community Templates</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TemplateHeader;
