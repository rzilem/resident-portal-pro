
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams, useNavigate } from 'react-router-dom';
import LeadsTable from '@/components/leads/LeadsTable';
import ProposalTemplates from '@/components/leads/ProposalTemplates';
import FollowUpEmails from '@/components/leads/FollowUpEmails';
import LeadAnalytics from '@/components/leads/LeadAnalytics';

const LeadsManagement = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = React.useState(tabFromUrl || "leads");
  
  // Sync URL with tab changes
  React.useEffect(() => {
    if (tabFromUrl && ['leads', 'proposals', 'emails', 'analytics'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/leads?tab=${value}`);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Lead Management</h1>
        <p className="text-muted-foreground">
          Track potential clients, create proposals, and manage client acquisition
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="leads">Active Leads</TabsTrigger>
          <TabsTrigger value="proposals">Proposal Templates</TabsTrigger>
          <TabsTrigger value="emails">Follow-up Emails</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="leads">
          <LeadsTable />
        </TabsContent>
        
        <TabsContent value="proposals">
          <ProposalTemplates />
        </TabsContent>
        
        <TabsContent value="emails">
          <FollowUpEmails />
        </TabsContent>
        
        <TabsContent value="analytics">
          <LeadAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeadsManagement;
