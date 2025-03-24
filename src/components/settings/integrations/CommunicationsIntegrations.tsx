
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, Phone, MessageSquare, Calendar } from "lucide-react";
import IntegrationCard from './IntegrationCard';

const CommunicationsIntegrations = () => {
  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="grid gap-6">
        {/* Email Service Integration */}
        <IntegrationCard 
          title="Email Service"
          description="Connect your email provider to send notifications, updates, and statements"
          icon={<Mail className="h-5 w-5" />}
          integrations={[
            { name: "Mailchimp", connected: true },
            { name: "SendGrid", connected: false },
            { name: "Amazon SES", connected: false },
            { name: "Custom SMTP", connected: false }
          ]}
        />
        
        {/* SMS Service Integration */}
        <IntegrationCard 
          title="SMS Service"
          description="Connect your SMS provider to send text message notifications"
          icon={<MessageSquare className="h-5 w-5" />}
          integrations={[
            { name: "Twilio", connected: false },
            { name: "Plivo", connected: false },
            { name: "Nexmo", connected: false }
          ]}
        />
        
        {/* Phone Service Integration */}
        <IntegrationCard 
          title="Phone Service"
          description="Connect your phone system for calls and voicemail"
          icon={<Phone className="h-5 w-5" />}
          integrations={[
            { name: "Twilio Voice", connected: false },
            { name: "RingCentral", connected: false },
            { name: "Vonage", connected: false },
            { name: "Microsoft Teams Phone", connected: false }
          ]}
        />
        
        {/* Microsoft Teams Phone Integration */}
        <IntegrationCard 
          title="Microsoft Teams Phone"
          description="Connect Microsoft Teams Phone for unified communications and calling capabilities"
          icon={<Phone className="h-5 w-5" />}
          integrations={[
            { name: "Teams Direct Routing", connected: false },
            { name: "Teams Calling Plan", connected: false },
            { name: "Teams Operator Connect", connected: false }
          ]}
        />
        
        {/* Calendar Integration */}
        <IntegrationCard 
          title="Calendar"
          description="Sync HOA events with external calendars"
          icon={<Calendar className="h-5 w-5" />}
          integrations={[
            { name: "Google Calendar", connected: true },
            { name: "Outlook Calendar", connected: false },
            { name: "Apple Calendar", connected: false }
          ]}
        />
      </div>
    </ScrollArea>
  );
};

export default CommunicationsIntegrations;
