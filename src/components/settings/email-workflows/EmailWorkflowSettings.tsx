import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipButton } from "@/components/ui/tooltip-button";
import { RefreshCw, Plus, Mail, BugPlay, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useEmailWorkflows } from '@/hooks/use-email-workflows';
import { useEmailToLead } from '@/hooks/use-email-to-lead';
import { toast } from 'sonner';
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import EmailWorkflowTable from './EmailWorkflowTable';
import EmailWorkflowDialog from './EmailWorkflowDialog';

const EmailWorkflowSettings: React.FC = () => {
  const { workflowRules, isLoading, error, fetchWorkflowRules, createWorkflowRule, updateWorkflowRule, deleteWorkflowRule, toggleWorkflowRuleStatus } = useEmailWorkflows();
  const { processEmailAsLead, isProcessing } = useEmailToLead();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);
  const [debugDialogOpen, setDebugDialogOpen] = useState(false);
  const [recentEmails, setRecentEmails] = useState<Array<{id: string, time: string, status: string}>>([]);
  const [debugEmail, setDebugEmail] = useState({
    from: "Test Lead <test@example.com>",
    subject: "Inquiry about your services",
    body: "Hello, I'm interested in learning more...",
    received_at: new Date().toISOString()
  });
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);
  const [monitoringActive, setMonitoringActive] = useState(false);

  const fetchRecentEmails = async () => {
    try {
      const response = await fetch('https://your-app.com/api/recent-emails');
      const data = await response.json();
      setRecentEmails(data.map((email: any) => ({
        id: email.id,
        time: new Date(email.received_at).toLocaleTimeString(),
        status: email.status
      })));
    } catch (err) {
      toast.error('Failed to load recent email activity');
    }
  };

  useEffect(() => {
    fetchRecentEmails();
    let interval: number | null = null;
    if (monitoringActive) {
      interval = window.setInterval(fetchRecentEmails, 30000);
    }
    return () => {
      if (interval !== null) {
        window.clearInterval(interval);
      }
    };
  }, [monitoringActive]);

  const handleTestEmail = () => {
    const testEmail = {
      from: "Test Lead <test@example.com>",
      subject: "Inquiry about your services",
      body: "Hello, I'm interested in learning more...",
      received_at: new Date().toISOString(),
      association: "Test Company",
      type: "Prospective",
      units: "5",
      city: "Test City"
    };
    const existingEmails = localStorage.getItem('testEmails');
    const emails = existingEmails ? JSON.parse(existingEmails) : [];
    emails.push(testEmail);
    localStorage.setItem('testEmails', JSON.stringify(emails));
    toast.success('Test email created! Click "Process Emails Now" to process it.');
  };

  const checkForNewEmails = async (silent = false) => {
    const testEmails = localStorage.getItem('testEmails');
    if (testEmails) {
      const emails = JSON.parse(testEmails);
      const emailEntries = emails.map((email: any) => ({
        id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        time: new Date().toLocaleTimeString(),
        status: 'processing'
      }));
      setRecentEmails(prev => [...emailEntries, ...prev].slice(0, 10));
      for (let i = 0; i < emails.length; i++) {
        const email = emails[i];
        const emailId = emailEntries[i].id;
        const result = await processEmailAsLead(email);
        recordProcessedEmail(emailId, !result?.error);
      }
      localStorage.removeItem('testEmails');
      toast.success('Test emails processed');
    }
    await fetchRecentEmails();
  };

  const handleDebugDialog = () => {
    setDebugDialogOpen(true);
  };

  const handleProcessDebugEmail = async () => {
    setProcessingStatus("Processing email...");
    const result = await processEmailAsLead(debugEmail);
    setProcessingStatus(result?.error ? `Error: ${result.error}` : `Success! Created new lead with ID: ${result?.id || 'unknown'}`);
    await fetchRecentEmails();
  };

  const handleProcess1202Email = async () => {
    const testEmail = {
      from: "Incoming Lead <lead@example.com>",
      subject: "12:02 Email Inquiry",
      body: "Received at 12:02, interested in property management services",
      received_at: new Date().toISOString()
    };

    try {
      const result = await processEmailAsLead(testEmail);
      
      if (result?.created) {
        toast.success(`New lead created from 12:02 email. Lead ID: ${result.id}`);
      } else if (result?.updated) {
        toast.success(`Existing lead updated from 12:02 email. Lead ID: ${result.id}`);
      } else {
        toast.error('Unexpected result when processing 12:02 email');
      }
    } catch (error) {
      console.error('Error processing 12:02 email:', error);
      toast.error('Failed to process 12:02 email');
    }
  };

  const recordProcessedEmail = (id: string, success: boolean) => {
    setRecentEmails(prev => prev.map(email => email.id === id ? { ...email, status: success ? 'success' : 'failed' } : email));
  };

  const handleAddClick = () => {
    setEditingRule(null);
    setDialogOpen(true);
  };

  const handleEditRule = (rule: any) => {
    setEditingRule(rule);
    setDialogOpen(true);
  };

  const handleSaveRule = (ruleData: any) => {
    if (editingRule) {
      updateWorkflowRule(editingRule.id, ruleData);
    } else {
      createWorkflowRule(ruleData);
    }
  };

  return (
    <div className="w-full">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Email Workflow Management</CardTitle>
            <CardDescription>Configure how incoming emails are processed and which workflows they trigger</CardDescription>
          </div>
          <div className="flex space-x-2">
            <TooltipButton 
              variant={monitoringActive ? "default" : "outline"} 
              size="sm" 
              onClick={() => setMonitoringActive(!monitoringActive)}
              tooltipText={monitoringActive ? "Stop monitoring emails" : "Start monitoring emails"}
            >
              {monitoringActive ? <><CheckCircle2 className="h-4 w-4 mr-2" />Monitoring Active</> : <><RefreshCw className="h-4 w-4 mr-2" />Start Monitoring</>}
            </TooltipButton>

            <TooltipButton 
              variant="outline" 
              size="sm" 
              onClick={() => checkForNewEmails(false)} 
              disabled={isLoading || isProcessing}
              tooltipText="Check and process new emails"
            >
              <RefreshCw className="h-4 w-4 mr-2" />Process Emails Now
            </TooltipButton>

            <TooltipButton 
              variant="outline" 
              size="sm" 
              onClick={handleTestEmail}
              tooltipText="Create a test email for processing"
            >
              <Mail className="h-4 w-4 mr-2" />Create Test Email
            </TooltipButton>

            <TooltipButton 
              variant="outline" 
              size="sm" 
              onClick={handleDebugDialog}
              tooltipText="Debug email processing"
            >
              <BugPlay className="h-4 w-4 mr-2" />Debug Email
            </TooltipButton>

            <TooltipButton 
              size="sm" 
              onClick={handleAddClick}
              tooltipText="Add a new workflow rule"
            >
              <Plus className="h-4 w-4 mr-2" />Add Rule
            </TooltipButton>
          </div>
        </CardHeader>
        <CardContent>
          {recentEmails.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Recent Email Activity</h3>
              <div className="bg-background border rounded-md p-4">
                {recentEmails.map(email => (
                  <div key={email.id} className="flex items-center justify-between p-2 border-b last:border-0">
                    <div className="flex items-center gap-2">
                      {email.status === 'processing' && <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />}
                      {email.status === 'success' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                      {email.status === 'failed' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      <span>Email received at {email.time}</span>
                    </div>
                    <Badge variant={email.status === 'success' ? 'success' : email.status === 'failed' ? 'destructive' : 'default'}>
                      {email.status.charAt(0).toUpperCase() + email.status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {workflowRules && workflowRules.length > 0 && (
            <div className="mt-6">
              <EmailWorkflowTable 
                workflowRules={workflowRules}
                onEdit={handleEditRule}
                onDelete={deleteWorkflowRule}
                onToggleStatus={toggleWorkflowRuleStatus}
              />
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleProcess1202Email}
            className="mt-4"
          >
            Process 12:02 Email
          </Button>
        </CardContent>
      </Card>

      <EmailWorkflowDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveRule}
        editingRule={editingRule}
      />

      <Dialog open={debugDialogOpen} onOpenChange={setDebugDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Debug Email Processing</DialogTitle>
            <DialogDescription>
              Test how an email would be processed by the system
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="from" className="text-sm font-medium">From</label>
              <Input 
                id="from" 
                value={debugEmail.from} 
                onChange={e => setDebugEmail({...debugEmail, from: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="subject" className="text-sm font-medium">Subject</label>
              <Input 
                id="subject" 
                value={debugEmail.subject} 
                onChange={e => setDebugEmail({...debugEmail, subject: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="body" className="text-sm font-medium">Body</label>
              <Textarea 
                id="body" 
                rows={6} 
                value={debugEmail.body} 
                onChange={e => setDebugEmail({...debugEmail, body: e.target.value})}
              />
            </div>
          </div>
          
          {processingStatus && (
            <div className={`p-3 rounded-md ${processingStatus.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {processingStatus}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDebugDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleProcessDebugEmail} disabled={isProcessing}>
              Process Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailWorkflowSettings;
