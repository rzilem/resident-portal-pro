
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import FinancialsIntegrations from './integrations/FinancialsIntegrations';
import CommunicationsIntegrations from './integrations/CommunicationsIntegrations';
import ManagementIntegrations from './integrations/ManagementIntegrations';
import AutomationIntegrations from './integrations/AutomationIntegrations';
import XAIDialog from './integrations/dialogs/XAIDialog';
import { useIntegrations } from '@/hooks/use-integrations';
import { toast } from 'sonner';

// Define the prop types for the integration components
interface IntegrationComponentProps {
  searchQuery?: string;
}

const IntegrationSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('financials');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showXAIDialog, setShowXAIDialog] = useState(false);
  const { fetchIntegrations } = useIntegrations();

  useEffect(() => {
    // Refresh integrations data when component mounts
    fetchIntegrations().catch(err => {
      console.error("Failed to refresh integrations:", err);
      toast.error("Failed to load integration settings");
    });
  }, [fetchIntegrations]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Integrations</CardTitle>
            <CardDescription>
              Connect third-party services and tools to enhance your property management capabilities
            </CardDescription>
          </div>
          
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search integrations..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
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
      
      {/* Single centralized XAI Dialog */}
      <XAIDialog 
        open={showXAIDialog} 
        onOpenChange={setShowXAIDialog} 
      />
    </Card>
  );
};

export default IntegrationSettings;
