import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus, Mail, BugPlay } from "lucide-react";
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
  const [debugEmail, setDebugEmail] = useState({
    from: "Test Lead <test@example.com>",
    subject: "Inquiry about your services",
    body: "Hello, I'm interested in learning more about your property management services. Please contact me at your earliest convenience.",
    received_at: new Date().toISOString()
  });
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);

  useEffect(() => {
    // Check for any unprocessed emails when component mounts
    checkForNewEmails();
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

  // Simulate checking for new emails
  const checkForNewEmails = async () => {
    // This would normally connect to an email API to check for new emails
    console.log('Checking for new emails...');
    
    // For testing purposes, we'll manually process a test email
    const testEmails = localStorage.getItem('testEmails');
    if (testEmails) {
      try {
        const emails = JSON.parse(testEmails);
        if (Array.isArray(emails) && emails.length > 0) {
          toast.info(`Processing ${emails.length} test emails`);
          
          for (const email of emails) {
            await processEmailAsLead(email);
          }
          
          // Clear the test emails after processing
          localStorage.removeItem('testEmails');
          toast.success('Test emails processed');
        }
      } catch (err) {
        console.error('Error processing test emails:', err);
        toast.error('Failed to process test emails');
      }
    }
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
    
    toast.success('Test email created! Click "Check For New Emails" to process it.');
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
            <Button variant="outline" size="sm" onClick={checkForNewEmails} disabled={isLoading || isProcessing}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Check For New Emails
            </Button>
            <Button variant="outline" size="sm" onClick={handleTestEmail}>
              <Mail className="h-4 w-4 mr-2" />
              Create Test Email
            </Button>
            <Button variant="outline" size="sm" onClick={handleDebugDialog}>
              <BugPlay className="h-4 w-4 mr-2" />
              Debug Email Processing
            </Button>
            <Button variant="outline" size="sm" onClick={fetchWorkflowRules} disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm" onClick={handleAddClick}>
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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

          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Email workflow rules determine how incoming messages are processed. Each rule maps an incoming email address to 
              a specific workflow type and forwarding address. When an email arrives at the inbound address, the system will 
              automatically trigger the associated workflow and forward the message as needed.
            </p>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <h3 className="font-medium text-blue-800">Testing Emails to Leads</h3>
              <p className="text-sm text-blue-700 mt-1">
                To test the email-to-lead functionality, click the "Create Test Email" button above, then click "Check For New Emails" 
                to process it. This will create a new lead from the test email. For more detailed testing, use the "Debug Email Processing" button.
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
