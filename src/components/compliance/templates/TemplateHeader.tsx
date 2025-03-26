
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAssociations } from '@/hooks/use-associations';
import { Association } from '@/types/association';

interface TemplateHeaderProps {
  associationId?: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TemplateHeader: React.FC<TemplateHeaderProps> = ({ 
  associationId,
  activeTab, 
  onTabChange 
}) => {
  const { associations } = useAssociations();
  
  // Find the association by ID
  const association = associations.find(a => a.id === associationId) || {} as Association;

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">
        Violation Templates
        {association.name && <span className="ml-2 text-muted-foreground">for {association.name}</span>}
      </h2>
      
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="association">
            Association Templates
          </TabsTrigger>
          <TabsTrigger value="custom">
            Custom Templates
          </TabsTrigger>
          <TabsTrigger value="unused">
            Unused Templates
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TemplateHeader;
