
import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import MessageComposer from '@/components/communications/MessageComposer';
import MessageTemplates from '@/components/communications/MessageTemplates';
import MessageHistory from '@/components/communications/MessageHistory';

const CommunityMessaging = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("compose");

  const handleSendMessage = (message: { subject: string; content: string; recipients: string[] }) => {
    console.log("Sending message:", message);
    // Here you would integrate with your backend service
    
    toast({
      title: "Message sent",
      description: `Your message has been sent to ${message.recipients.length} recipients.`,
    });
  };

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
              <Tabs defaultValue="compose" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="compose">Compose Message</TabsTrigger>
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                  <TabsTrigger value="history">Message History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="compose" className="mt-6">
                  <MessageComposer onSendMessage={handleSendMessage} />
                </TabsContent>
                
                <TabsContent value="templates" className="mt-6">
                  <MessageTemplates onSelectTemplate={(template) => {
                    setActiveTab("compose");
                  }} />
                </TabsContent>
                
                <TabsContent value="history" className="mt-6">
                  <MessageHistory />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityMessaging;
