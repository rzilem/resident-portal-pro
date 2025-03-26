
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, MessageSquare, Phone, FileText } from "lucide-react";
import IntegrationCard from './IntegrationCard';

const CommunicationsIntegrations = () => {
  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="grid gap-6">
        {/* Email Services */}
        <IntegrationCard 
          title="Email Services"
          description="Connect email service providers for sending communications"
          icon={<Mail className="h-5 w-5" />}
          integrations={[
            { 
              name: "SendGrid", 
              connected: false,
              apiFields: [
                { name: 'apiKey', label: 'API Key', type: 'password', required: true },
                { name: 'fromEmail', label: 'From Email', type: 'text', required: true }
              ]
            },
            { 
              name: "Mailchimp", 
              connected: false,
              apiFields: [
                { name: 'apiKey', label: 'API Key', type: 'password', required: true },
                { name: 'serverPrefix', label: 'Server Prefix', type: 'text', required: true, description: 'The server prefix in your API key (e.g., "us1")' },
                { name: 'defaultListId', label: 'Default List ID', type: 'text', required: true }
              ]
            },
            { 
              name: "Postmark", 
              connected: false,
              apiFields: [
                { name: 'serverToken', label: 'Server Token', type: 'password', required: true },
                { name: 'fromEmail', label: 'From Email', type: 'text', required: true },
                { name: 'templatePrefix', label: 'Template Prefix', type: 'text', description: 'Optional prefix for template identification' }
              ]
            }
          ]}
        />
        
        {/* Text Messaging */}
        <IntegrationCard 
          title="Text Messaging"
          description="Connect SMS services for text notifications"
          icon={<MessageSquare className="h-5 w-5" />}
          integrations={[
            { 
              name: "Twilio", 
              connected: false,
              apiFields: [
                { name: 'accountSid', label: 'Account SID', type: 'text', required: true },
                { name: 'authToken', label: 'Auth Token', type: 'password', required: true },
                { name: 'phoneNumber', label: 'Twilio Phone Number', type: 'text', required: true }
              ]
            },
            { 
              name: "Nexmo (Vonage)", 
              connected: false,
              apiFields: [
                { name: 'apiKey', label: 'API Key', type: 'text', required: true },
                { name: 'apiSecret', label: 'API Secret', type: 'password', required: true },
                { name: 'from', label: 'From Number/ID', type: 'text', required: true }
              ]
            }
          ]}
        />
        
        {/* Voice Services */}
        <IntegrationCard 
          title="Voice Services"
          description="Connect voice calling and IVR services"
          icon={<Phone className="h-5 w-5" />}
          integrations={[
            { 
              name: "Twilio Voice", 
              connected: false,
              apiFields: [
                { name: 'accountSid', label: 'Account SID', type: 'text', required: true },
                { name: 'authToken', label: 'Auth Token', type: 'password', required: true },
                { name: 'phoneNumber', label: 'Twilio Phone Number', type: 'text', required: true },
                { name: 'callbackUrl', label: 'Voice Callback URL', type: 'url', description: 'URL that will handle voice XML responses' }
              ]
            }
          ]}
        />
        
        {/* Document Services */}
        <IntegrationCard 
          title="Document Services"
          description="Connect document generation and signature services"
          icon={<FileText className="h-5 w-5" />}
          integrations={[
            { 
              name: "DocuSign", 
              connected: false,
              apiFields: [
                { name: 'integrationKey', label: 'Integration Key', type: 'text', required: true },
                { name: 'secret', label: 'Secret Key', type: 'password', required: true },
                { name: 'redirectUri', label: 'Redirect URI', type: 'url', required: true },
                { name: 'accountId', label: 'Account ID', type: 'text', description: 'Optional if using default account' }
              ]
            },
            { 
              name: "Adobe Sign", 
              connected: false,
              apiFields: [
                { name: 'clientId', label: 'Client ID', type: 'text', required: true },
                { name: 'clientSecret', label: 'Client Secret', type: 'password', required: true },
                { name: 'redirectUri', label: 'Redirect URI', type: 'url', required: true }
              ]
            }
          ]}
        />
      </div>
    </ScrollArea>
  );
};

export default CommunicationsIntegrations;
