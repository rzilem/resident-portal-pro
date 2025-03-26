
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building, Map, Calendar, Clock } from "lucide-react";
import IntegrationCard from './IntegrationCard';

const ManagementIntegrations = () => {
  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="grid gap-6">
        {/* Property Management */}
        <IntegrationCard 
          title="Property Management Systems"
          description="Connect your existing property management software"
          icon={<Building className="h-5 w-5" />}
          integrations={[
            { 
              name: "Buildium", 
              connected: false,
              apiFields: [
                { name: 'clientId', label: 'Client ID', type: 'text', required: true },
                { name: 'clientSecret', label: 'Client Secret', type: 'password', required: true },
                { name: 'developerApiKey', label: 'Developer API Key', type: 'password', required: true }
              ]
            },
            { 
              name: "AppFolio", 
              connected: false,
              apiFields: [
                { name: 'apiKey', label: 'API Key', type: 'password', required: true },
                { name: 'databaseId', label: 'Database ID', type: 'text', required: true },
                { name: 'companyId', label: 'Company ID', type: 'text', required: true }
              ]
            },
            { 
              name: "Yardi", 
              connected: false,
              apiFields: [
                { name: 'username', label: 'Username', type: 'text', required: true },
                { name: 'password', label: 'Password', type: 'password', required: true },
                { name: 'platformUrl', label: 'Platform URL', type: 'url', required: true },
                { name: 'clientId', label: 'Client ID', type: 'text', required: true }
              ]
            }
          ]}
        />
        
        {/* Mapping Services */}
        <IntegrationCard 
          title="Mapping & Location Services"
          description="Integrate mapping and location-based services"
          icon={<Map className="h-5 w-5" />}
          integrations={[
            { 
              name: "Google Maps", 
              connected: false,
              apiFields: [
                { name: 'apiKey', label: 'API Key', type: 'password', required: true },
                { name: 'enabledApis', label: 'Enabled APIs', type: 'text', description: 'Comma-separated list of Google Maps APIs you want to use', placeholder: 'maps,places,geocoding' }
              ]
            },
            { 
              name: "Mapbox", 
              connected: false,
              apiFields: [
                { name: 'accessToken', label: 'Access Token', type: 'password', required: true },
                { name: 'defaultStyle', label: 'Default Style', type: 'text', placeholder: 'mapbox://styles/mapbox/streets-v11' }
              ]
            }
          ]}
        />
        
        {/* Calendar Services */}
        <IntegrationCard 
          title="Calendar Services"
          description="Sync with calendar providers for meeting scheduling"
          icon={<Calendar className="h-5 w-5" />}
          integrations={[
            { 
              name: "Google Calendar", 
              connected: false,
              apiFields: [
                { name: 'clientId', label: 'Client ID', type: 'text', required: true },
                { name: 'clientSecret', label: 'Client Secret', type: 'password', required: true },
                { name: 'redirectUri', label: 'Redirect URI', type: 'url', required: true }
              ]
            },
            { 
              name: "Microsoft Outlook", 
              connected: false,
              apiFields: [
                { name: 'clientId', label: 'Client ID', type: 'text', required: true },
                { name: 'clientSecret', label: 'Client Secret', type: 'password', required: true },
                { name: 'redirectUri', label: 'Redirect URI', type: 'url', required: true },
                { name: 'tenantId', label: 'Tenant ID', type: 'text', description: 'Optional tenant ID for Microsoft authentication' }
              ]
            }
          ]}
        />
        
        {/* Time Tracking */}
        <IntegrationCard 
          title="Time Tracking"
          description="Integrate with time tracking solutions for maintenance and staff"
          icon={<Clock className="h-5 w-5" />}
          integrations={[
            { 
              name: "Toggl", 
              connected: false,
              apiFields: [
                { name: 'apiToken', label: 'API Token', type: 'password', required: true },
                { name: 'workspaceId', label: 'Workspace ID', type: 'text', description: 'Optional specific workspace ID' }
              ]
            },
            { 
              name: "Harvest", 
              connected: false,
              apiFields: [
                { name: 'accessToken', label: 'Access Token', type: 'password', required: true },
                { name: 'accountId', label: 'Account ID', type: 'text', required: true }
              ]
            }
          ]}
        />
      </div>
    </ScrollArea>
  );
};

export default ManagementIntegrations;
