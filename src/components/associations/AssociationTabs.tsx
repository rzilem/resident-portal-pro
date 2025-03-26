
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Association } from '@/types/association';
import { Property } from '@/components/properties/PropertyHelpers';
import AssociationDetailsTab from './tabs/AssociationDetailsTab';
import AssociationFinancialsTab from './tabs/AssociationFinancialsTab';
import AssociationPropertiesTab from './tabs/AssociationPropertiesTab';
import AssociationDocumentsTab from './tabs/AssociationDocumentsTab';
import AssociationSettingsTab from './tabs/AssociationSettingsTab';

interface AssociationTabsProps {
  association: Association;
  properties: Property[];
}

const AssociationTabs: React.FC<AssociationTabsProps> = ({ association, properties }) => {
  return (
    <Tabs defaultValue="details" className="w-full mt-6">
      <TabsList className="grid grid-cols-5 md:w-[500px]">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="financials">Financials</TabsTrigger>
        <TabsTrigger value="properties">Properties</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="details">
        <AssociationDetailsTab association={association} />
      </TabsContent>

      <TabsContent value="financials">
        <AssociationFinancialsTab association={association} />
      </TabsContent>

      <TabsContent value="properties">
        <AssociationPropertiesTab properties={properties} association={association} />
      </TabsContent>

      <TabsContent value="documents">
        <AssociationDocumentsTab association={association} />
      </TabsContent>

      <TabsContent value="settings">
        <AssociationSettingsTab association={association} />
      </TabsContent>
    </Tabs>
  );
};

export default AssociationTabs;
