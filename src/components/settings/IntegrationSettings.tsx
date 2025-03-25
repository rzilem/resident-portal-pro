
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FinancialsIntegrations from './integrations/FinancialsIntegrations';
import CommunicationsIntegrations from './integrations/CommunicationsIntegrations';
import ManagementIntegrations from './integrations/ManagementIntegrations';
import AutomationIntegrations from './integrations/AutomationIntegrations';

const IntegrationSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('financials');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
        <CardDescription>
          Connect third-party services and tools to enhance your property management capabilities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="financials">
            <FinancialsIntegrations />
          </TabsContent>
          
          <TabsContent value="communications">
            <CommunicationsIntegrations />
          </TabsContent>
          
          <TabsContent value="management">
            <ManagementIntegrations />
          </TabsContent>
          
          <TabsContent value="automation">
            <AutomationIntegrations />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IntegrationSettings;
