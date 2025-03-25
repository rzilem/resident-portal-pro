
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
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
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader />
      
      <div className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in">
        <div className="grid gap-4 md:gap-6 mb-6">
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Community Messaging</h2>
                <p className="text-muted-foreground">Send messages to your entire community or specific groups</p>
              </div>
            </div>
          </section>
          
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
      </div>
    </div>
  );
};

export default CommunityMessaging;
