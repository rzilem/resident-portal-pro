
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import IntegrationCard from './IntegrationCard';
import { Mail, MessageSquare, Phone, Volume2 } from 'lucide-react';

const CommunicationsIntegrations: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Communications Integrations</CardTitle>
          <CardDescription>
            Connect email services, messaging platforms, and other communication tools
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <IntegrationCard
            title="SendGrid"
            description="Email delivery service for transactional and marketing emails"
            icon={<Mail className="h-5 w-5 text-primary" />}
            isApiKey
            apiFields={[
              { name: 'apiKey', label: 'API Key', type: 'password', required: true },
              { name: 'fromEmail', label: 'From Email', type: 'email', required: true },
              { name: 'fromName', label: 'From Name', type: 'text', required: false }
            ]}
          />
          
          <IntegrationCard
            title="Twilio"
            description="SMS, voice, and messaging service for resident notifications"
            icon={<Phone className="h-5 w-5 text-primary" />}
            isApiKey
            apiFields={[
              { name: 'accountSid', label: 'Account SID', type: 'text', required: true },
              { name: 'authToken', label: 'Auth Token', type: 'password', required: true },
              { name: 'phoneNumber', label: 'Phone Number', type: 'text', required: true }
            ]}
          />
          
          <IntegrationCard
            title="Slack"
            description="Team collaboration and messaging platform"
            icon={<MessageSquare className="h-5 w-5 text-primary" />}
            isWebhook
          />
          
          <IntegrationCard
            title="ElevenLabs"
            description="High-quality AI voice synthesis for voice greetings and announcements"
            icon={<Volume2 className="h-5 w-5 text-primary" />}
            isApiKey
            apiFields={[
              { name: 'apiKey', label: 'API Key', type: 'password', required: true },
              { name: 'defaultVoiceId', label: 'Default Voice ID', type: 'text', required: false, 
                hint: 'Optional: Voice ID for default voice (e.g., EXAVITQu4vr4xnSDxMaL for Sarah)' },
              { name: 'defaultModel', label: 'Default Model', type: 'select', required: false,
                options: [
                  { value: 'eleven_turbo_v2', label: 'Eleven Turbo v2 (faster)' },
                  { value: 'eleven_multilingual_v2', label: 'Eleven Multilingual v2 (higher quality)' }
                ],
                defaultValue: 'eleven_turbo_v2',
                hint: 'Optional: Model to use for voice synthesis' }
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunicationsIntegrations;
