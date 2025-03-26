
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

const AssociationTabs: React.FC<AssociationTabsProps> = ({ association, properties }) => {
  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid grid-cols-6 md:w-[600px]">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="financials">Financials</TabsTrigger>
        <TabsTrigger value="properties">Properties</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="details" className="mt-2">
        <AssociationDetailsTab association={association} />
      </TabsContent>

      <TabsContent value="financials" className="mt-2">
        <AssociationFinancialsTab association={association} />
      </TabsContent>

      <TabsContent value="properties" className="mt-2">
        <AssociationPropertiesTab properties={properties} association={association} />
      </TabsContent>

      <TabsContent value="documents" className="mt-2">
        <AssociationDocumentsTab association={association} />
      </TabsContent>
      
      <TabsContent value="members" className="mt-2">
        <AssociationMembersTab association={association} />
      </TabsContent>

      <TabsContent value="settings" className="mt-2">
        <AssociationSettingsTab association={association} />
      </TabsContent>
    </Tabs>
  );
};

export default AssociationTabs;
