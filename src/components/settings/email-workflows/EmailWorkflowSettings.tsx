import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus, Mail, BugPlay, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useEmailWorkflows } from '@/hooks/use-email-workflows';
import { useEmailToLead } from '@/hooks/use-email-to-lead';
import { toast } from 'sonner';
// ... other imports ...

const EmailWorkflowSettings: React.FC = () => {
  const { workflowRules, isLoading, error, fetchWorkflowRules, createWorkflowRule, updateWorkflowRule, deleteWorkflowRule, toggleWorkflowRuleStatus } = useEmailWorkflows();
  const { processEmailAsLead, isProcessing } = useEmailToLead();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [debugDialogOpen, setDebugDialogOpen] = useState(false);
  const [recentEmails, setRecentEmails] = useState([]);
  const [debugEmail, setDebugEmail] = useState({
    from: "Test Lead <test@example.com>",
    subject: "Inquiry about your services",
    body: "Hello, I'm interested in learning more...",
    received_at: new Date().toISOString()
  });
  const [processingStatus, setProcessingStatus] = useState(null);
  const [monitoringActive, setMonitoringActive] = useState(false);

  const fetchRecentEmails = async () => {
    try {
      const response = await fetch('https://your-app.com/api/recent-emails'); // Adjust URL
      const data = await response.json();
      setRecentEmails(data.map(email => ({
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
    let interval = null;
    if (monitoringActive) {
      interval = window.setInterval(fetchRecentEmails, 30000);
    }
    return () => interval && window.clearInterval(interval);
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
      const emailEntries = emails.map(email => ({
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
    await fetchRecentEmails(); // Update with server data
  };

  const handleProcessDebugEmail = async () => {
    setProcessingStatus("Processing email...");
    const result = await processEmailAsLead(debugEmail);
    setProcessingStatus(result?.error ? `Error: ${result.error}` : `Success! Created new lead with ID: ${result?.id || 'unknown'}`);
    await fetchRecentEmails();
  };

  const recordProcessedEmail = (id, success) => {
    setRecentEmails(prev => prev.map(email => email.id === id ? { ...email, status: success ? 'success' : 'failed' } : email));
  };

  // ... rest of the functions (handleAddClick, handleEditClick, etc.) remain unchanged ...

  return (
    <div className="w-full">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Email Workflow Management</CardTitle>
            <CardDescription>Configure how incoming emails are processed and which workflows they trigger</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant={monitoringActive ? "default" : "outline"} size="sm" onClick={() => setMonitoringActive(!monitoringActive)}>
              {monitoringActive ? <><CheckCircle2 className="h-4 w-4 mr-2" />Monitoring Active</> : <><RefreshCw className="h-4 w-4 mr-2" />Start Monitoring</>}
            </Button>
            <Button variant="outline" size="sm" onClick={() => checkForNewEmails(false)} disabled={isLoading || isProcessing}><RefreshCw className="h-4 w-4 mr-2" />Process Emails Now</Button>
            <Button variant="outline" size="sm" onClick={handleTestEmail}><Mail className="h-4 w-4 mr-2" />Create Test Email</Button>
            <Button variant="outline" size="sm" onClick={handleDebugDialog}><BugPlay className="h-4 w-4 mr-2" />Debug Email</Button>
            <Button size="sm" onClick={handleAddClick}><Plus className="h-4 w-4 mr-2" />Add Rule</Button>
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
          {/* ... rest of the JSX (table, dialogs, etc.) remains unchanged ... */}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailWorkflowSettings;
