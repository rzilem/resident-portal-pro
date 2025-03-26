
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResidentProfile } from '@/types/resident';
import SummaryTab from './SummaryTab';
import PropertyTab from './PropertyTab';
import FinancialTab from './FinancialTab';
import CommunicationsTab from './CommunicationsTab';
import DocumentsTab from './DocumentsTab';
import NotesTab from './NotesTab';

interface ResidentTabsProps {
  resident: ResidentProfile;
}

const ResidentTabs: React.FC<ResidentTabsProps> = ({ resident }) => {
  return (
    <Tabs defaultValue="summary" className="space-y-6">
      <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full bg-background">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="property">Property</TabsTrigger>
        <TabsTrigger value="financial">Financial</TabsTrigger>
        <TabsTrigger value="communications">Communications</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>

      <TabsContent value="summary" className="space-y-6">
        <SummaryTab resident={resident} />
      </TabsContent>

      <TabsContent value="property" className="space-y-6">
        <PropertyTab propertyDetails={resident.propertyDetails} />
      </TabsContent>

      <TabsContent value="financial" className="space-y-6">
        <FinancialTab 
          transactions={resident.accountHistory} 
          resident={resident}
        />
      </TabsContent>

      <TabsContent value="communications" className="space-y-6">
        <CommunicationsTab communications={resident.communications} />
      </TabsContent>

      <TabsContent value="documents" className="space-y-6">
        <DocumentsTab documents={resident.documents} />
      </TabsContent>

      <TabsContent value="notes" className="space-y-6">
        <NotesTab notes={resident.notes} />
      </TabsContent>
    </Tabs>
  );
};

export default ResidentTabs;
