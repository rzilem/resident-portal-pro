
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCommunityMessaging } from './useCommunityMessaging';
import CommunityTabsContent from './CommunityTabsContent';

const CommunityMessaging = () => {
  const {
    activeTab,
    setActiveTab,
    templates,
    selectedTemplate,
    composeKey,
    handleSendMessage,
    handleTemplateSelect,
    handleTemplateCreate,
    handleTemplateUpdate,
    handleTemplateDelete,
  } = useCommunityMessaging();

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Community Messaging</CardTitle>
          <CardDescription>
            Compose and send messages to your community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CommunityTabsContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            templates={templates}
            selectedTemplate={selectedTemplate}
            composeKey={composeKey}
            onSendMessage={handleSendMessage}
            onSelectTemplate={handleTemplateSelect}
            onCreateTemplate={handleTemplateCreate}
            onUpdateTemplate={handleTemplateUpdate}
            onDeleteTemplate={handleTemplateDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityMessaging;
