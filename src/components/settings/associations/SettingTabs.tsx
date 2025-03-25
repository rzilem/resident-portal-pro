
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicSettings from './tabs/BasicSettings';
import FinancialSettings from './tabs/FinancialSettings';
import DocumentSettings from './tabs/DocumentSettings';
import CommunicationSettings from './tabs/CommunicationSettings';
import MeetingSettings from './tabs/MeetingSettings';
import NotificationSettings from './tabs/NotificationSettings';
import CustomMergeTagsSettings from './CustomMergeTagsSettings';

const SettingTabs = () => {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 w-full">
        <TabsTrigger value="basic">Basic</TabsTrigger>
        <TabsTrigger value="financial">Financial</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="communications">Communications</TabsTrigger>
        <TabsTrigger value="meetings">Meetings</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="merge-tags">Merge Tags</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic" className="py-6">
        <BasicSettings />
      </TabsContent>
      
      <TabsContent value="financial" className="py-6">
        <FinancialSettings />
      </TabsContent>
      
      <TabsContent value="documents" className="py-6">
        <DocumentSettings />
      </TabsContent>
      
      <TabsContent value="communications" className="py-6">
        <CommunicationSettings />
      </TabsContent>
      
      <TabsContent value="meetings" className="py-6">
        <MeetingSettings />
      </TabsContent>
      
      <TabsContent value="notifications" className="py-6">
        <NotificationSettings />
      </TabsContent>

      <TabsContent value="merge-tags" className="py-6">
        <CustomMergeTagsSettings />
      </TabsContent>
    </Tabs>
  );
};

export default SettingTabs;
