
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MessageComposer from '@/components/communications/MessageComposer';
import MessageTemplates from '@/components/communications/MessageTemplates';
import MessageHistory from '@/components/communications/MessageHistory';
import { MessageTemplate, CompositionMessage } from './types';

interface CommunityTabsContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  templates: MessageTemplate[];
  selectedTemplate: MessageTemplate | null;
  composeKey: string;
  onSendMessage: (message: CompositionMessage) => void;
  onSelectTemplate: (template: MessageTemplate) => void;
  onCreateTemplate: (template: MessageTemplate) => void;
  onUpdateTemplate: (template: MessageTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
}

const CommunityTabsContent: React.FC<CommunityTabsContentProps> = ({
  activeTab,
  setActiveTab,
  templates,
  selectedTemplate,
  composeKey,
  onSendMessage,
  onSelectTemplate,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
}) => {
  return (
    <Tabs defaultValue="compose" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="compose">Compose Message</TabsTrigger>
        <TabsTrigger value="templates">Templates</TabsTrigger>
        <TabsTrigger value="history">Message History</TabsTrigger>
      </TabsList>
      
      <TabsContent value="compose" className="mt-6">
        <MessageComposer 
          onSendMessage={onSendMessage}
          initialSubject={selectedTemplate?.subject || ''}
          initialContent={selectedTemplate?.content || ''}
          key={composeKey} // Use composeKey to force re-render when template changes
        />
      </TabsContent>
      
      <TabsContent value="templates" className="mt-6">
        <MessageTemplates 
          onSelectTemplate={onSelectTemplate}
          templates={templates}
          onCreateTemplate={onCreateTemplate}
          onUpdateTemplate={onUpdateTemplate}
          onDeleteTemplate={onDeleteTemplate}
        />
      </TabsContent>
      
      <TabsContent value="history" className="mt-6">
        <MessageHistory />
      </TabsContent>
    </Tabs>
  );
};

export default CommunityTabsContent;
