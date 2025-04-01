
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams, useNavigate } from 'react-router-dom';
import LeadsTable from '@/components/leads/LeadsTable';
import ProposalTemplates from '@/components/leads/ProposalTemplates';
import FollowUpEmails from '@/components/leads/FollowUpEmails';
import LeadAnalytics from '@/components/leads/LeadAnalytics';
import { Button } from '@/components/ui/button';
import { RefreshCw, Mail, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useEmailToLead } from '@/hooks/use-email-to-lead';

const LeadsManagement = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { processEmailAsLead, isProcessing } = useEmailToLead();
  
  const [activeTab, setActiveTab] = useState(tabFromUrl || "leads");
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  
  // Sync URL with tab changes
  useEffect(() => {
    if (tabFromUrl && ['leads', 'proposals', 'emails', 'analytics'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);
  
  // Auto refresh leads data when component mounts and periodically
  useEffect(() => {
    // Initial refresh
    queryClient.invalidateQueries({ queryKey: ['leads'] });
    
    // Set up periodic refresh - every 15 seconds
    const intervalId = setInterval(() => {
      console.log('Auto-refreshing leads data...');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setLastRefreshed(new Date());
    }, 15000); // Reduced from 30s to 15s to be more responsive
    
    return () => clearInterval(intervalId);
  }, [queryClient]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/leads?tab=${value}`);
  };
  
  const handleRefresh = () => {
    console.log('Manual refresh triggered');
    queryClient.invalidateQueries({ queryKey: ['leads'] });
    setRefreshKey(prev => prev + 1);
    setLastRefreshed(new Date());
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
      const result = await processEmailAsLead(testEmail);
      console.log('Test email processing result:', result);
      
      if (result?.error) {
        toast.error(`Failed to create test lead: ${result.error}`);
      } else {
        // Force refresh immediately
        queryClient.invalidateQueries({ queryKey: ['leads'] });
        setLastRefreshed(new Date());
        
        if (result?.created) {
          toast.success('New test lead created from email!');
        } else if (result?.updated) {
          toast.success('Existing lead updated from test email!');
        } else {
          toast.success('Test email processed successfully!');
        }
      }
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
            <Button onClick={handleTestEmailLead} variant="outline" size="sm" disabled={isProcessing}>
              <Mail className="h-4 w-4 mr-2" />
              {isProcessing ? 'Processing...' : 'Create Test Email Lead'}
            </Button>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            Track potential clients, create proposals, and manage client acquisition
          </p>
          <p className="text-xs text-muted-foreground">
            Last refreshed: {lastRefreshed.toLocaleTimeString()}
          </p>
        </div>
      </div>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-amber-800">Email Lead Processing Information</h3>
          <p className="text-sm text-amber-700 mt-1">
            For real emails to be processed as leads, your email server must be configured to forward 
            incoming emails to the application's email processing endpoint. You can use the "Create Test Email Lead" 
            button above to test the lead creation process with a sample email, or visit the Email Workflows 
            settings page to configure and debug email processing.
          </p>
        </div>
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
