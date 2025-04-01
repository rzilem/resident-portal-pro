
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams, useNavigate } from 'react-router-dom';
import LeadsTable from '@/components/leads/LeadsTable';
import ProposalTemplates from '@/components/leads/ProposalTemplates';
import FollowUpEmails from '@/components/leads/FollowUpEmails';
import LeadAnalytics from '@/components/leads/LeadAnalytics';
import { Button } from '@/components/ui/button';
import { RefreshCw, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useEmailToLead } from '@/hooks/use-email-to-lead';

const LeadsManagement = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { processEmailAsLead } = useEmailToLead();
  
  const [activeTab, setActiveTab] = useState(tabFromUrl || "leads");
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Sync URL with tab changes
  useEffect(() => {
    if (tabFromUrl && ['leads', 'proposals', 'emails', 'analytics'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);
  
  // Auto refresh leads data when component mounts
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['leads'] });
  }, [queryClient]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/leads?tab=${value}`);
  };
  
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['leads'] });
    setRefreshKey(prev => prev + 1);
    toast.success("Refreshing data...");
  };
  
  const handleTestEmailLead = async () => {
    // Create a test email for demonstration
    const testEmail = {
      from: "Test Lead <test@example.com>",
      subject: "Inquiry about your services",
      body: "Hello, I'm interested in learning more about your property management services. Please contact me at your earliest convenience.",
      received_at: new Date().toISOString()
    };
    
    toast.info('Processing test email...');
    
    try {
      await processEmailAsLead(testEmail);
      // Force refresh
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Test lead created from email!');
    } catch (err) {
      console.error('Error creating test lead:', err);
      toast.error('Failed to create test lead');
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Lead Management</h1>
          <div className="flex space-x-2">
            <Button onClick={handleTestEmailLead} variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Create Test Email Lead
            </Button>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
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
        
        <TabsContent value="leads" key={`leads-${refreshKey}`}>
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
