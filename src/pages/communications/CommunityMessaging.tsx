
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import MessageComposer from '@/components/communications/MessageComposer';
import MessageHistory from '@/components/communications/MessageHistory';
import { useCommunityMessaging } from './useCommunityMessaging';
import { Tab } from './types';
import { INITIAL_TEMPLATES } from './useCommunityMessaging';

interface CommunityMessagingProps {
  initialTab?: Tab;
}

const CommunityMessaging: React.FC<CommunityMessagingProps> = ({ initialTab = 'compose' }) => {
  const {
    selectedTab,
    setSelectedTab,
    messageText,
    setMessageText,
    subject,
    setSubject,
    scheduledDate,
    setScheduledDate,
    handleSendMessage
  } = useCommunityMessaging(initialTab);

  const handleTabChange = (value: string) => {
    setSelectedTab(value as Tab);
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community Messaging</h1>
          <p className="text-muted-foreground">
            Create and send communications to your community members
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <Tabs value={selectedTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex h-auto p-0">
              <TabsTrigger value="compose" className="rounded-none data-[state=active]:rounded-t-md">
                Compose
              </TabsTrigger>
              <TabsTrigger value="history" className="rounded-none data-[state=active]:rounded-t-md">
                Message History
              </TabsTrigger>
              <TabsTrigger value="templates" className="rounded-none data-[state=active]:rounded-t-md">
                Templates
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="pt-6">
          <TabsContent value="compose" className="m-0">
            <MessageComposer
              onSendMessage={handleSendMessage}
              initialSubject={subject}
              initialContent={messageText}
            />
          </TabsContent>
          <TabsContent value="history" className="m-0">
            <MessageHistory />
          </TabsContent>
          <TabsContent value="templates" className="m-0">
            <div className="text-center p-8 text-muted-foreground">
              Loading message templates...
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityMessaging;
