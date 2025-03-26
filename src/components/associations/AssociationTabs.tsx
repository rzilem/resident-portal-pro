
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Association } from '@/types/association';
import { Property } from '@/components/properties/PropertyHelpers';
import AssociationDetailsTab from './tabs/AssociationDetailsTab';
import AssociationFinancialsTab from './tabs/AssociationFinancialsTab';
import AssociationPropertiesTab from './tabs/AssociationPropertiesTab';
import AssociationDocumentsTab from './tabs/AssociationDocumentsTab';
import AssociationMembersTab from './tabs/AssociationMembersTab';
import AssociationSettingsTab from './tabs/AssociationSettingsTab';

interface AssociationTabsProps {
  association: Association;
  properties: Property[];
}

interface TabConfig {
  id: string;
  label: string;
  content: React.FC<{ association: Association; properties?: Property[] }>;
  requiresProperties?: boolean;
}

const AssociationTabs: React.FC<AssociationTabsProps> = ({ association, properties }) => {
  const tabConfigs: TabConfig[] = [
    {
      id: 'details',
      label: 'Details',
      content: AssociationDetailsTab
    },
    {
      id: 'financials',
      label: 'Financials',
      content: AssociationFinancialsTab
    },
    {
      id: 'properties',
      label: 'Properties',
      content: AssociationPropertiesTab,
      requiresProperties: true
    },
    {
      id: 'documents',
      label: 'Documents',
      content: AssociationDocumentsTab
    },
    {
      id: 'members',
      label: 'Members',
      content: AssociationMembersTab
    },
    {
      id: 'settings',
      label: 'Settings',
      content: AssociationSettingsTab
    }
  ];

  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid grid-cols-6 w-full">
        {tabConfigs.map(tab => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabConfigs.map(tab => (
        <TabsContent 
          key={tab.id} 
          value={tab.id}
        >
          {tab.requiresProperties ? (
            <tab.content association={association} properties={properties} />
          ) : (
            <tab.content association={association} />
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default AssociationTabs;
