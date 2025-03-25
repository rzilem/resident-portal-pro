
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicSettings from './tabs/BasicSettings';
import FinancialSettings from './tabs/FinancialSettings';
import DocumentSettings from './tabs/DocumentSettings';
import CommunicationSettings from './tabs/CommunicationSettings';
import MeetingSettings from './tabs/MeetingSettings';
import NotificationSettings from './tabs/NotificationSettings';
import CustomMergeTagsSettings from './CustomMergeTagsSettings';
import { Association } from '@/types/association';

interface SettingTabsProps {
  activeAssociation: Association;
  handleSettingChange: (key: string, value: any) => Promise<void>;
  getSetting: (key: string, defaultValue?: any) => any;
  updateAssociation: (id: string, updates: Partial<Association>) => Promise<Association>;
}

const SettingTabs: React.FC<SettingTabsProps> = ({
  activeAssociation,
  handleSettingChange,
  getSetting,
  updateAssociation
}) => {
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
        <BasicSettings 
          activeAssociation={activeAssociation}
          handleSettingChange={handleSettingChange}
          getSetting={getSetting}
          updateAssociation={updateAssociation}
        />
      </TabsContent>
      
      <TabsContent value="financial" className="py-6">
        <FinancialSettings 
          handleSettingChange={handleSettingChange}
          getSetting={getSetting}
        />
      </TabsContent>
      
      <TabsContent value="documents" className="py-6">
        <DocumentSettings 
          handleSettingChange={handleSettingChange}
          getSetting={getSetting}
        />
      </TabsContent>
      
      <TabsContent value="communications" className="py-6">
        <CommunicationSettings 
          activeAssociation={activeAssociation}
          handleSettingChange={handleSettingChange}
          getSetting={getSetting}
        />
      </TabsContent>
      
      <TabsContent value="meetings" className="py-6">
        <MeetingSettings 
          handleSettingChange={handleSettingChange}
          getSetting={getSetting}
        />
      </TabsContent>
      
      <TabsContent value="notifications" className="py-6">
        <NotificationSettings 
          handleSettingChange={handleSettingChange}
          getSetting={getSetting}
        />
      </TabsContent>

      <TabsContent value="merge-tags" className="py-6">
        <CustomMergeTagsSettings />
      </TabsContent>
    </Tabs>
  );
};

export default SettingTabs;
