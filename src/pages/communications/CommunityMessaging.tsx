
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MessageComposer from '@/components/communications/MessageComposer';
import MessageHistory from '@/components/communications/MessageHistory';
import MessageTemplates from '@/components/communications/MessageTemplates';
import { useCommunityMessaging } from './useCommunityMessaging';

interface CommunityMessagingProps {
  initialTab?: 'compose' | 'history' | 'templates';
}

const CommunityMessaging: React.FC<CommunityMessagingProps> = ({ initialTab = 'compose' }) => {
  const {
    selectedTab,
    setSelectedTab,
    recipientTypes,
    formatOptions,
    messageTypes,
    handleUpdateSelectedRecipientType,
    handleUpdateSelectedFormat,
    handleUpdateSelectedMessageType,
    handleSendMessage,
    handleSaveAsDraft,
    handleSchedule,
    handleOpenAISuggestion,
    messageText,
    setMessageText,
    subject,
    setSubject,
    scheduledDate,
    setScheduledDate
  } = useCommunityMessaging(initialTab);

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
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
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
              recipientTypes={recipientTypes}
              formatOptions={formatOptions}
              messageTypes={messageTypes}
              onSelectRecipientType={handleUpdateSelectedRecipientType}
              onSelectFormat={handleUpdateSelectedFormat}
              onSelectMessageType={handleUpdateSelectedMessageType}
              onSend={handleSendMessage}
              onSaveAsDraft={handleSaveAsDraft}
              onSchedule={handleSchedule}
              onOpenAISuggestion={handleOpenAISuggestion}
              messageText={messageText}
              onMessageTextChange={setMessageText}
              subject={subject}
              onSubjectChange={setSubject}
              scheduledDate={scheduledDate}
              onScheduledDateChange={setScheduledDate}
            />
          </TabsContent>
          <TabsContent value="history" className="m-0">
            <MessageHistory />
          </TabsContent>
          <TabsContent value="templates" className="m-0">
            <MessageTemplates />
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityMessaging;
