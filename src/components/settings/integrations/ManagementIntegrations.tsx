
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Building, Users, Mail, Phone, MessageSquare } from "lucide-react";
import IntegrationCard from './IntegrationCard';

const ManagementIntegrations = () => {
  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="grid gap-6">
        {/* Property Management Systems */}
        <IntegrationCard 
          title="Property Management Systems"
          description="Connect with comprehensive property management solutions"
          icon={<Building className="h-5 w-5" />}
          integrations={[
            { name: "Microsoft Dynamics 365", connected: false },
            { name: "Buildium", connected: false },
            { name: "Yardi", connected: false },
            { name: "AppFolio", connected: false },
            { name: "PropertyBoss", connected: false }
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
            { name: "Box", connected: false },
            { name: "SharePoint", connected: false }
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
            { name: "Breezeway", connected: false },
            { name: "Property Meld", connected: false },
            { name: "Facility Management Systems", connected: false }
          ]}
        />

        {/* Vendor Communications */}
        <IntegrationCard 
          title="Vendor Management"
          description="Systems for vendor communications and management"
          icon={<Users className="h-5 w-5" />}
          integrations={[
            { name: "Coupa", connected: false },
            { name: "SAP Ariba", connected: false },
            { name: "Procurify", connected: false },
            { name: "HomeAdvisor", connected: false },
            { name: "Custom Vendor Portal", connected: false }
          ]}
        />

        {/* Board & Committee Collaboration */}
        <IntegrationCard 
          title="Board & Committee Collaboration"
          description="Tools for board and committee communication and collaboration"
          icon={<Mail className="h-5 w-5" />}
          integrations={[
            { name: "Microsoft Teams", connected: false },
            { name: "Slack", connected: false },
            { name: "BoardEffect", connected: false },
            { name: "BoardBookit", connected: false },
            { name: "Boardable", connected: false }
          ]}
        />

        {/* Invoice Approval Systems */}
        <IntegrationCard 
          title="Invoice Approval Systems"
          description="Systems for invoice approver notifications and workflows"
          icon={<MessageSquare className="h-5 w-5" />}
          integrations={[
            { name: "Bill.com", connected: false },
            { name: "AvidXchange", connected: false },
            { name: "Concur Invoice", connected: false },
            { name: "QuickBooks", connected: false },
            { name: "Tipalti", connected: false }
          ]}
        />
      </div>
    </ScrollArea>
  );
};

export default ManagementIntegrations;
