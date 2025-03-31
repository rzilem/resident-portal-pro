
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ChatbotButton from '@/components/ChatbotButton';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TooltipButton } from '@/components/ui/tooltip-button';
import { MessageSquare, Calendar, FileText, Settings, Users, Bell } from 'lucide-react';
import { toast } from 'sonner';

const CommunityHub = () => {
  const [activeTab, setActiveTab] = useState('ai-assistant');

  const handleDocumentAccess = (documentType: string) => {
    toast.success(`Opening ${documentType}`, {
      description: "Redirecting to document portal."
    });
  };

  return (
    <div className="grid gap-4 animate-fade-in p-6">
      <h2 className="text-2xl font-bold">Community Hub</h2>
      <p className="text-muted-foreground mb-4">Interact with AI assistant and community resources</p>

      <div className="flex flex-wrap gap-3 mb-4">
        <TooltipButton 
          variant="default" 
          asChild 
          tooltipText="Compose and send community messages"
        >
          <Link to="/communications/messaging">
            <MessageSquare className="h-4 w-4 mr-1" />
            Send Message
          </Link>
        </TooltipButton>

        <TooltipButton 
          variant="default" 
          asChild 
          tooltipText="Manage community announcements"
        >
          <Link to="/communications/announcements">
            <Bell className="h-4 w-4 mr-1" />
            Announcements
          </Link>
        </TooltipButton>

        <TooltipButton 
          variant="outline" 
          asChild 
          tooltipText="View community calendar"
        >
          <Link to="/calendar">
            <Calendar className="h-4 w-4 mr-1" />
            Calendar
          </Link>
        </TooltipButton>

        <TooltipButton 
          variant="outline" 
          asChild 
          tooltipText="View resident directory"
        >
          <Link to="/residents">
            <Users className="h-4 w-4 mr-1" />
            Residents
          </Link>
        </TooltipButton>
      </div>

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
                      <li>• <Link to="/calendar" className="text-primary hover:underline">Community Calendar</Link></li>
                      <li>• <Link to="/documents/association" className="text-primary hover:underline">HOA Documents</Link></li>
                      <li>• <Link to="/residents" className="text-primary hover:underline">Resident Directory</Link></li>
                      <li>• <Button variant="link" className="p-0 h-auto text-primary hover:underline" onClick={() => toast.info("Maintenance portal coming soon")}>Maintenance Portal</Button></li>
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
                    <li><Button variant="link" className="p-0 h-auto text-primary hover:underline" onClick={() => handleDocumentAccess("HOA Bylaws")}>HOA Bylaws</Button></li>
                    <li><Button variant="link" className="p-0 h-auto text-primary hover:underline" onClick={() => handleDocumentAccess("Community Guidelines")}>Community Guidelines</Button></li>
                    <li><Button variant="link" className="p-0 h-auto text-primary hover:underline" onClick={() => handleDocumentAccess("Architectural Standards")}>Architectural Standards</Button></li>
                    <li><Button variant="link" className="p-0 h-auto text-primary hover:underline" onClick={() => handleDocumentAccess("Financial Reports")}>Financial Reports</Button></li>
                    <li><Button variant="link" className="p-0 h-auto text-primary hover:underline" onClick={() => handleDocumentAccess("Meeting Minutes")}>Meeting Minutes</Button></li>
                  </ul>
                </div>
                <div className="p-4 bg-background rounded-md border">
                  <h3 className="font-medium mb-2">Forms</h3>
                  <ul className="space-y-1">
                    <li><Button variant="link" className="p-0 h-auto text-primary hover:underline" onClick={() => handleDocumentAccess("Architectural Request")}>Architectural Request</Button></li>
                    <li><Button variant="link" className="p-0 h-auto text-primary hover:underline" onClick={() => handleDocumentAccess("Maintenance Request")}>Maintenance Request</Button></li>
                    <li><Button variant="link" className="p-0 h-auto text-primary hover:underline" onClick={() => handleDocumentAccess("Complaint Form")}>Complaint Form</Button></li>
                    <li><Button variant="link" className="p-0 h-auto text-primary hover:underline" onClick={() => handleDocumentAccess("Resident Information Update")}>Resident Information Update</Button></li>
                    <li><Button variant="link" className="p-0 h-auto text-primary hover:underline" onClick={() => handleDocumentAccess("Community Room Reservation")}>Community Room Reservation</Button></li>
                  </ul>
                </div>
                <div className="p-4 bg-background rounded-md border">
                  <h3 className="font-medium mb-2">Guides</h3>
                  <ul className="space-y-1">
                    <li><Button variant="link" className="p-0 h-auto text-primary hover:underline" onClick={() => handleDocumentAccess("New Resident Guide")}>New Resident Guide</Button></li>
                    <li><Button variant="link" className="p-0 h-auto text-primary hover:underline" onClick={() => handleDocumentAccess("Homeowner FAQ")}>Homeowner FAQ</Button></li>
                    <li><Button variant="link" className="p-0 h-auto text-primary hover:underline" onClick={() => handleDocumentAccess("Amenities Guide")}>Amenities Guide</Button></li>
                    <li><Button variant="link" className="p-0 h-auto text-primary hover:underline" onClick={() => handleDocumentAccess("Emergency Procedures")}>Emergency Procedures</Button></li>
                    <li><Button variant="link" className="p-0 h-auto text-primary hover:underline" onClick={() => handleDocumentAccess("Local Resources")}>Local Resources</Button></li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="community">
              <div className="p-4 bg-muted/50 rounded-md">
                <h3 className="text-lg font-medium mb-2">Community Forum</h3>
                <p>Connect with your neighbors, share information, and discuss community matters.</p>
                <div className="mt-4 p-4 bg-background rounded-md border">
                  <p className="text-center text-muted-foreground mb-4">Community forum features coming soon.</p>
                  <div className="flex justify-center">
                    <TooltipButton 
                      variant="default" 
                      onClick={() => toast.info("Community forum will be available in the next update")}
                      tooltipText="Access community forum when available"
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Join Forum Beta
                    </TooltipButton>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityHub;
