
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CommunicationsIntegrations from './integrations/CommunicationsIntegrations';
import FinancialsIntegrations from './integrations/FinancialsIntegrations';
import ManagementIntegrations from './integrations/ManagementIntegrations';
import AutomationIntegrations from './integrations/AutomationIntegrations';

const IntegrationSettings = () => {
  const [activeTab, setActiveTab] = useState("communications");
  
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>
            Connect your HOA management system with external services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
              <TabsTrigger value="communications">Communications</TabsTrigger>
              <TabsTrigger value="financials">Financial</TabsTrigger>
              <TabsTrigger value="management">Management</TabsTrigger>
              <TabsTrigger value="automation">Automation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="communications">
              <CommunicationsIntegrations />
            </TabsContent>
            
            <TabsContent value="financials">
              <FinancialsIntegrations />
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
    </div>
  );
};

export default IntegrationSettings;
