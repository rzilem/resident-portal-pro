
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SummaryTab from './SummaryTab';
import FinancialTab from './FinancialTab';
import CommunicationsTab from './CommunicationsTab';
import NotesTab from './NotesTab';
import DocumentsTab from './DocumentsTab';
import PropertyTab from './PropertyTab';
import { ResidentProfile } from '@/types/resident';

interface ResidentTabsProps {
  resident: ResidentProfile;
}

const ResidentTabs: React.FC<ResidentTabsProps> = ({ resident }) => {
  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-4">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="financial">Financial</TabsTrigger>
        <TabsTrigger value="communications">Communications</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="property">Property</TabsTrigger>
      </TabsList>
      
      {/* Summary Tab */}
      <TabsContent value="summary">
        <SummaryTab resident={resident} />
      </TabsContent>
      
      {/* Financial Tab */}
      <TabsContent value="financial">
        <FinancialTab transactions={resident.accountHistory} />
      </TabsContent>
      
      {/* Communications Tab */}
      <TabsContent value="communications">
        <CommunicationsTab communications={resident.communications} />
      </TabsContent>
      
      {/* Notes Tab */}
      <TabsContent value="notes">
        <NotesTab notes={resident.notes} activityLogs={resident.activityLogs} />
      </TabsContent>
      
      {/* Documents Tab */}
      <TabsContent value="documents">
        <DocumentsTab documents={resident.documents} />
      </TabsContent>
      
      {/* Property Tab */}
      <TabsContent value="property">
        <PropertyTab propertyDetails={resident.propertyDetails} status={resident.status} />
      </TabsContent>
    </Tabs>
  );
};

export default ResidentTabs;
