
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ChatbotButton from '@/components/ChatbotButton';

const CommunityHub = () => {
  const [activeTab, setActiveTab] = useState('ai-assistant');

  return (
    <div className="grid gap-4 animate-fade-in">
      <h2 className="text-2xl font-bold">Community Hub</h2>
      <p className="text-muted-foreground mb-4">Interact with AI assistant and community resources</p>

      <Card>
        <CardHeader>
          <CardTitle>HOA Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ai-assistant">
              <div className="p-4 bg-muted/50 rounded-md">
                <h3 className="text-lg font-medium mb-2">Ask me anything</h3>
                <p className="mb-4">Use the chat button in the corner to ask questions about your community, HOA rules, upcoming events, or any other information.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-background rounded-md border">
                    <h4 className="font-medium">Common Questions</h4>
                    <ul className="mt-2 space-y-2">
                      <li>• How do I pay my HOA dues?</li>
                      <li>• When is the next board meeting?</li>
                      <li>• What are the pool hours?</li>
                      <li>• How do I submit a maintenance request?</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-background rounded-md border">
                    <h4 className="font-medium">Quick Links</h4>
                    <ul className="mt-2 space-y-2">
                      <li>• <a href="#" className="text-primary hover:underline">Community Calendar</a></li>
                      <li>• <a href="#" className="text-primary hover:underline">HOA Documents</a></li>
                      <li>• <a href="#" className="text-primary hover:underline">Resident Directory</a></li>
                      <li>• <a href="#" className="text-primary hover:underline">Maintenance Portal</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="resources">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-background rounded-md border">
                  <h3 className="font-medium mb-2">Documents</h3>
                  <ul className="space-y-1">
                    <li><a href="#" className="text-primary hover:underline">HOA Bylaws</a></li>
                    <li><a href="#" className="text-primary hover:underline">Community Guidelines</a></li>
                    <li><a href="#" className="text-primary hover:underline">Architectural Standards</a></li>
                    <li><a href="#" className="text-primary hover:underline">Financial Reports</a></li>
                    <li><a href="#" className="text-primary hover:underline">Meeting Minutes</a></li>
                  </ul>
                </div>
                <div className="p-4 bg-background rounded-md border">
                  <h3 className="font-medium mb-2">Forms</h3>
                  <ul className="space-y-1">
                    <li><a href="#" className="text-primary hover:underline">Architectural Request</a></li>
                    <li><a href="#" className="text-primary hover:underline">Maintenance Request</a></li>
                    <li><a href="#" className="text-primary hover:underline">Complaint Form</a></li>
                    <li><a href="#" className="text-primary hover:underline">Resident Information Update</a></li>
                    <li><a href="#" className="text-primary hover:underline">Community Room Reservation</a></li>
                  </ul>
                </div>
                <div className="p-4 bg-background rounded-md border">
                  <h3 className="font-medium mb-2">Guides</h3>
                  <ul className="space-y-1">
                    <li><a href="#" className="text-primary hover:underline">New Resident Guide</a></li>
                    <li><a href="#" className="text-primary hover:underline">Homeowner FAQ</a></li>
                    <li><a href="#" className="text-primary hover:underline">Amenities Guide</a></li>
                    <li><a href="#" className="text-primary hover:underline">Emergency Procedures</a></li>
                    <li><a href="#" className="text-primary hover:underline">Local Resources</a></li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="community">
              <div className="p-4 bg-muted/50 rounded-md">
                <h3 className="text-lg font-medium mb-2">Community Forum</h3>
                <p>Connect with your neighbors, share information, and discuss community matters.</p>
                <div className="mt-4 p-4 bg-background rounded-md border">
                  <p className="text-center text-muted-foreground">Community forum features coming soon.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* The ChatbotButton is already fixed */}
    </div>
  );
};

export default CommunityHub;
