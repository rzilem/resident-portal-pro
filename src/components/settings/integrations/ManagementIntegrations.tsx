
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Building } from "lucide-react";
import IntegrationCard from './IntegrationCard';

const ManagementIntegrations = () => {
  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="grid gap-6">
        {/* Microsoft Dynamics 365 */}
        <IntegrationCard 
          title="Microsoft Dynamics 365"
          description="Connect with Microsoft Dynamics 365 for comprehensive business management"
          icon={<Building className="h-5 w-5" />}
          integrations={[
            { name: "Dynamics 365 Business Central", connected: false },
            { name: "Dynamics 365 Finance", connected: false },
            { name: "Dynamics 365 Customer Service", connected: false },
            { name: "Dynamics 365 Field Service", connected: false }
          ]}
        />
        
        {/* Document Management */}
        <IntegrationCard 
          title="Document Management"
          description="Connect document storage services"
          icon={<FileText className="h-5 w-5" />}
          integrations={[
            { name: "Google Drive", connected: true },
            { name: "Dropbox", connected: false },
            { name: "OneDrive", connected: false },
            { name: "Box", connected: false }
          ]}
        />
        
        {/* Maintenance Management */}
        <IntegrationCard 
          title="Maintenance & Work Orders"
          description="Connect maintenance management systems"
          icon={<Building className="h-5 w-5" />}
          integrations={[
            { name: "BuildingLink", connected: false },
            { name: "FixxFlo", connected: false },
            { name: "Breezeway", connected: false }
          ]}
        />
      </div>
    </ScrollArea>
  );
};

export default ManagementIntegrations;
