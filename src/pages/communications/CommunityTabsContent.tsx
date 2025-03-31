
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MessageComposer from '@/components/communications/MessageComposer';
import MessageHistory from '@/components/communications/history/MessageHistory';
import TemplateManager from '@/components/communications/templates/TemplateManager';
import { MessageTemplate, CompositionMessage } from './types';

interface CommunityTabsContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  templates: MessageTemplate[];
  selectedTemplate: MessageTemplate | null;
  composeKey: string;
  onSendMessage: (message: CompositionMessage) => void;
  onSelectTemplate: (template: MessageTemplate) => void;
  onCreateTemplate: (template: MessageTemplate) => Promise<void>;
  onUpdateTemplate: (template: MessageTemplate) => Promise<void>;
  onDeleteTemplate: (templateId: string) => Promise<void>;
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
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full">
        <TabsTrigger value="compose">Compose</TabsTrigger>
        <TabsTrigger value="history">Message History</TabsTrigger>
        <TabsTrigger value="templates">Templates</TabsTrigger>
      </TabsList>
      
      <TabsContent value="compose" className="px-0 pt-4">
        <MessageComposer 
          key={composeKey}
          onSendMessage={onSendMessage}
          initialSubject={selectedTemplate?.subject}
          initialContent={selectedTemplate?.content}
        />
      </TabsContent>
      
      <TabsContent value="history" className="px-0 pt-4">
        <MessageHistory />
      </TabsContent>
      
      <TabsContent value="templates" className="px-0 pt-4">
        <TemplateManager
          templates={templates}
          onSelectTemplate={onSelectTemplate}
          onCreateTemplate={onCreateTemplate}
          onUpdateTemplate={onUpdateTemplate}
          onDeleteTemplate={onDeleteTemplate}
        />
      </TabsContent>
    </Tabs>
  );
};

export default CommunityTabsContent;
