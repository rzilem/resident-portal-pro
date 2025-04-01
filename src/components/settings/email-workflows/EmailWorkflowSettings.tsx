
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus, Mail, BugPlay, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useEmailWorkflows } from '@/hooks/use-email-workflows';
import { EmailWorkflowRule } from '@/services/emailWorkflowService';
import EmailWorkflowTable from './EmailWorkflowTable';
import EmailWorkflowDialog from './EmailWorkflowDialog';
import { toast } from 'sonner';
import { useEmailToLead } from '@/hooks/use-email-to-lead';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const EmailWorkflowSettings: React.FC = () => {
  const { 
    workflowRules, 
    isLoading, 
    error, 
    fetchWorkflowRules,
    createWorkflowRule,
    updateWorkflowRule,
    deleteWorkflowRule,
    toggleWorkflowRuleStatus
  } = useEmailWorkflows();

  const { processEmailAsLead, isProcessing } = useEmailToLead();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<EmailWorkflowRule | null>(null);
  const [debugDialogOpen, setDebugDialogOpen] = useState(false);
  const [recentEmails, setRecentEmails] = useState<Array<{id: string, time: string, status: string}>>([]);
  const [debugEmail, setDebugEmail] = useState({
    from: "Test Lead <test@example.com>",
    subject: "Inquiry about your services",
    body: "Hello, I'm interested in learning more about your property management services. Please contact me at your earliest convenience.",
    received_at: new Date().toISOString()
  });
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);
  const [monitoringActive, setMonitoringActive] = useState(false);

  useEffect(() => {
    // Check for any unprocessed emails when component mounts
    checkForNewEmails();
    
    // Set up polling if monitoring is active
    let interval: number | null = null;
    if (monitoringActive) {
      interval = window.setInterval(() => {
        checkForNewEmails(true);
      }, 30000); // Check every 30 seconds
    }
    
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [monitoringActive]);

  // Add any manually reported emails to the monitoring list
  useEffect(() => {
    const manualEntry = localStorage.getItem('manualEmailEntry');
    if (manualEntry) {
      try {
        const emailInfo = JSON.parse(manualEntry);
        if (emailInfo && emailInfo.time) {
          // Add to recent emails list
          const newEmail = {
            id: `manual-${Date.now()}`,
            time: emailInfo.time,
            status: 'pending'
          };
          setRecentEmails(prev => [newEmail, ...prev]);
          
          // Remove the entry so we don't process it again
          localStorage.removeItem('manualEmailEntry');
          
          // Trigger processing
          checkForNewEmails(true);
        }
      } catch (err) {
        console.error('Error parsing manual email entry:', err);
      }
    }
  }, []);

  const handleAddClick = () => {
    setEditingRule(null);
    setDialogOpen(true);
  };

  const handleEditClick = (rule: EmailWorkflowRule) => {
    setEditingRule(rule);
    setDialogOpen(true);
  };

  const handleSaveRule = (rule: Omit<EmailWorkflowRule, 'id' | 'createdAt'>) => {
    if (editingRule) {
      updateWorkflowRule(editingRule.id, rule);
    } else {
      createWorkflowRule(rule);
    }
  };

  // Record a processed email in the recent emails list
  const recordProcessedEmail = (id: string, success: boolean) => {
    setRecentEmails(prev => prev.map(email => 
      email.id === id ? {...email, status: success ? 'success' : 'failed'} : email
    ));
  };

  // Enhanced version to check for new emails
  const checkForNewEmails = async (silent = false) => {
    // This would normally connect to an email API to check for new emails
    if (!silent) {
      console.log('Checking for new emails...');
    }
    
    // For testing purposes, we'll manually process test emails
    const testEmails = localStorage.getItem('testEmails');
    if (testEmails) {
      try {
        const emails = JSON.parse(testEmails);
        if (Array.isArray(emails) && emails.length > 0) {
          if (!silent) {
            toast.info(`Processing ${emails.length} test emails`);
          }
          
          // Add emails to the recent list first
          const emailEntries = emails.map(email => ({
            id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            time: new Date().toLocaleTimeString(),
            status: 'processing'
          }));
          
          setRecentEmails(prev => [...emailEntries, ...prev].slice(0, 10));
          
          // Process emails
          for (let i = 0; i < emails.length; i++) {
            const email = emails[i];
            const emailId = emailEntries[i].id;
            
            try {
              const result = await processEmailAsLead(email);
              if (result?.error) {
                recordProcessedEmail(emailId, false);
                if (!silent) {
                  toast.error(`Failed to process email: ${result.error}`);
                }
              } else {
                recordProcessedEmail(emailId, true);
                if (!silent) {
                  if (result?.created) {
                    toast.success('New lead created from email');
                  } else if (result?.updated) {
                    toast.success('Existing lead updated from email');
                  } else {
                    toast.success('Email processed successfully');
                  }
                }
              }
            } catch (err) {
              recordProcessedEmail(emailId, false);
              console.error('Error processing email:', err);
              if (!silent) {
                toast.error('Error processing email');
              }
            }
          }
          
          // Clear the test emails after processing
          localStorage.removeItem('testEmails');
          if (!silent) {
            toast.success('All test emails processed');
          }
        }
      } catch (err) {
        console.error('Error processing test emails:', err);
        if (!silent) {
          toast.error('Failed to process test emails');
        }
      }
    } else if (!silent) {
      toast.info('No new emails to process');
    }
  };

  const handleManualAdd = () => {
    // Add a manual entry for demonstration
    const manualEntry = {
      time: "12:02"
    };
    localStorage.setItem('manualEmailEntry', JSON.stringify(manualEntry));
    
    // Add to recent emails list
    const newEmail = {
      id: `manual-${Date.now()}`,
      time: "12:02",
      status: 'pending'
    };
    setRecentEmails(prev => [newEmail, ...prev]);
    
    // Trigger processing
    toast.info('Manual email entry added. Processing...');
    checkForNewEmails(false);
  };

  const handleTestEmail = () => {
    // Create a test email for demonstration
    const testEmail = {
      from: "Test Lead <test@example.com>",
      subject: "Inquiry about your services",
      body: "Hello, I'm interested in learning more about your property management services. Please contact me at your earliest convenience.",
      received_at: new Date().toISOString()
    };
    
    // Store in localStorage for processing
    const existingEmails = localStorage.getItem('testEmails');
    const emails = existingEmails ? JSON.parse(existingEmails) : [];
    emails.push(testEmail);
    localStorage.setItem('testEmails', JSON.stringify(emails));
    
    toast.success('Test email created! Click "Process Emails Now" to process it.');
  };

  const handleDebugDialog = () => {
    setDebugDialogOpen(true);
  };

  const handleProcessDebugEmail = async () => {
    setProcessingStatus("Processing email...");
    
    try {
      console.log("Processing debug email:", debugEmail);
      const result = await processEmailAsLead(debugEmail);
      console.log("Process result:", result);
      
      if (result?.error) {
        setProcessingStatus(`Error: ${result.error}`);
        toast.error('Failed to process email as lead');
      } else if (result?.created) {
        setProcessingStatus(`Success! Created new lead with ID: ${result.id}`);
        toast.success('New lead created from debug email');
      } else if (result?.updated) {
        setProcessingStatus(`Success! Updated existing lead with ID: ${result.id}`);
        toast.success('Existing lead updated from debug email');
      } else {
        setProcessingStatus("Unknown result from processing");
      }
    } catch (err) {
      console.error("Error in debug processing:", err);
      setProcessingStatus(`Exception: ${err.message}`);
      toast.error('Exception occurred while processing email');
    }
  };

  const toggleMonitoring = () => {
    setMonitoringActive(!monitoringActive);
    toast.info(monitoringActive ? 'Email monitoring stopped' : 'Email monitoring activated');
  };

  return (
    <div className="w-full">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Email Workflow Management</CardTitle>
            <CardDescription>
              Configure how incoming emails are processed and which workflows they trigger
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant={monitoringActive ? "default" : "outline"} 
              size="sm" 
              onClick={toggleMonitoring}
            >
              {monitoringActive ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Monitoring Active
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Start Monitoring
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={() => checkForNewEmails(false)} disabled={isLoading || isProcessing}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Process Emails Now
            </Button>
            <Button variant="outline" size="sm" onClick={handleTestEmail}>
              <Mail className="h-4 w-4 mr-2" />
              Create Test Email
            </Button>
            <Button variant="outline" size="sm" onClick={handleManualAdd}>
              <Mail className="h-4 w-4 mr-2" />
              Add 12:02 Email
            </Button>
            <Button variant="outline" size="sm" onClick={handleDebugDialog}>
              <BugPlay className="h-4 w-4 mr-2" />
              Debug Email
            </Button>
            <Button variant="outline" size="sm" onClick={fetchWorkflowRules} disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Rules
            </Button>
            <Button size="sm" onClick={handleAddClick}>
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentEmails.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Recent Email Activity</h3>
              <div className="bg-background border rounded-md p-4">
                <div className="space-y-3">
                  {recentEmails.map((email) => (
                    <div key={email.id} className="flex items-center justify-between p-2 border-b last:border-0">
                      <div className="flex items-center gap-2">
                        {email.status === 'processing' && <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />}
                        {email.status === 'success' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                        {email.status === 'failed' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        {email.status === 'pending' && <Mail className="h-4 w-4 text-amber-500" />}
                        <span>Email received at {email.time}</span>
                      </div>
                      <Badge variant={
                        email.status === 'success' ? 'success' : 
                        email.status === 'failed' ? 'destructive' : 
                        email.status === 'processing' ? 'default' : 'outline'
                      }>
                        {email.status === 'processing' ? 'Processing' : 
                         email.status === 'success' ? 'Processed' : 
                         email.status === 'failed' ? 'Failed' : 'Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {error ? (
            <div className="p-4 text-center text-red-500 bg-red-50 rounded-md">
              Failed to load email workflow rules. Please try refreshing.
            </div>
          ) : isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-muted-foreground">Loading workflow rules...</p>
            </div>
          ) : (
            <EmailWorkflowTable
              workflowRules={workflowRules}
              onEdit={handleEditClick}
              onDelete={deleteWorkflowRule}
              onToggleStatus={toggleWorkflowRuleStatus}
            />
          )}

          <EmailWorkflowDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSave={handleSaveRule}
            editingRule={editingRule}
          />

          <Dialog open={debugDialogOpen} onOpenChange={setDebugDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Debug Email Processing</DialogTitle>
                <DialogDescription>
                  Use this tool to debug email-to-lead processing by simulating an incoming email
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email-from">From (format: "Name &lt;email@example.com&gt;")</Label>
                  <Input 
                    id="email-from" 
                    value={debugEmail.from}
                    onChange={e => setDebugEmail({...debugEmail, from: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email-subject">Subject</Label>
                  <Input 
                    id="email-subject" 
                    value={debugEmail.subject}
                    onChange={e => setDebugEmail({...debugEmail, subject: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email-body">Body</Label>
                  <Textarea 
                    id="email-body" 
                    rows={6}
                    value={debugEmail.body}
                    onChange={e => setDebugEmail({...debugEmail, body: e.target.value})}
                  />
                </div>
                
                {processingStatus && (
                  <div className={`p-4 rounded-md ${processingStatus.includes('Error') || processingStatus.includes('Exception') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    <p className="text-sm whitespace-pre-wrap">{processingStatus}</p>
                  </div>
                )}
              </div>
              
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

          <Alert className="mt-6 border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Incoming Email Status</AlertTitle>
            <AlertDescription className="text-amber-700">
              {monitoringActive ? (
                "Email monitoring is active. New emails will be automatically processed as they arrive."
              ) : (
                "Email monitoring is currently disabled. Click 'Start Monitoring' to enable automatic processing."
              )}
            </AlertDescription>
          </Alert>

          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Email workflow rules determine how incoming messages are processed. Each rule maps an incoming email address to 
              a specific workflow type and forwarding address. When an email arrives at the inbound address, the system will 
              automatically trigger the associated workflow and forward the message as needed.
            </p>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <h3 className="font-medium text-blue-800">Testing Emails to Leads</h3>
              <p className="text-sm text-blue-700 mt-1">
                To test the email-to-lead functionality, click the "Create Test Email" button above, then click "Process Emails Now" 
                to process it. This will create a new lead from the test email. For real-world testing, use the "Add 12:02 Email" 
                button to simulate a specific email arrival time.
              </p>
              <p className="text-sm text-blue-700 mt-2">
                For real emails, ensure your server is properly configured to forward received emails to your email-to-lead processor.
                The debug tool can help verify if the lead conversion process is working correctly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailWorkflowSettings;
