
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommunityTabsContent from './CommunityTabsContent';
import MessageComposer from '@/components/communications/MessageComposer';
import MessageHistory from '@/components/communications/MessageHistory';
import MessageTemplatesComponent from '@/components/communications/MessageTemplates';
import useCommunityMessaging from './useCommunityMessaging';
import { Tab } from './types';

const CommunityMessaging: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>({ id: 'compose', label: 'Compose Message' });
  const {
    recipientTypes,
    formatOptions,
    messageTypes,
    selectedRecipientType,
    selectedFormat,
    selectedMessageType,
    subject,
    content,
    selectedRecipients,
    scheduledDate,
    setSelectedRecipientType,
    setSelectedFormat,
    setSelectedMessageType,
    setSubject,
    setContent,
    setSelectedRecipients,
    setScheduledDate,
    handleSendMessage,
    handleScheduleMessage,
    templates,
  } = useCommunityMessaging();

  const handleTabChange = (value: string) => {
    const tab = value === 'compose' 
      ? { id: 'compose', label: 'Compose Message' }
      : value === 'history'
      ? { id: 'history', label: 'Message History' }
      : { id: 'templates', label: 'Message Templates' };
    
    setActiveTab(tab);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Community Messaging</h1>
      
      <Tabs defaultValue="compose" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="compose">Compose Message</TabsTrigger>
          <TabsTrigger value="history">Message History</TabsTrigger>
          <TabsTrigger value="templates">Message Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="compose">
          <CommunityTabsContent activeTab={activeTab}>
            <MessageComposer
              subject={subject}
              content={content}
              selectedRecipients={selectedRecipients}
              selectedRecipientType={selectedRecipientType}
              selectedFormat={selectedFormat}
              selectedMessageType={selectedMessageType}
              scheduledDate={scheduledDate}
              onSubjectChange={setSubject}
              onContentChange={setContent}
              onSelectRecipients={setSelectedRecipients}
              onSelectRecipientType={setSelectedRecipientType}
              onSelectFormat={setSelectedFormat}
              onSelectMessageType={setSelectedMessageType}
              onScheduledDateChange={setScheduledDate}
              onSendMessage={handleSendMessage}
              onScheduleMessage={handleScheduleMessage}
              recipientTypes={recipientTypes}
              formatOptions={formatOptions}
              messageTypes={messageTypes}
              availableTemplates={templates}
            />
          </CommunityTabsContent>
        </TabsContent>
        
        <TabsContent value="history">
          <CommunityTabsContent activeTab={activeTab}>
            <MessageHistory />
          </CommunityTabsContent>
        </TabsContent>
        
        <TabsContent value="templates">
          <CommunityTabsContent activeTab={activeTab}>
            <MessageTemplatesComponent 
              onSelectTemplate={() => {}}
              templates={templates}
              onCreateTemplate={async () => {}}
              onUpdateTemplate={async () => {}}
              onDeleteTemplate={async () => {}}
            />
          </CommunityTabsContent>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityMessaging;
