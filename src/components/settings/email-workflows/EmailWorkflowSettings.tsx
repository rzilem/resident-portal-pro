
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus, Mail } from "lucide-react";
import { useEmailWorkflows } from '@/hooks/use-email-workflows';
import { EmailWorkflowRule } from '@/services/emailWorkflowService';
import EmailWorkflowTable from './EmailWorkflowTable';
import EmailWorkflowDialog from './EmailWorkflowDialog';
import { toast } from 'sonner';
import { useEmailToLead } from '@/hooks/use-email-to-lead';

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

  const { processEmailAsLead } = useEmailToLead();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<EmailWorkflowRule | null>(null);

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

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Email Workflow Management</CardTitle>
          <CardDescription>
            Configure how incoming emails are processed and which workflows they trigger
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={checkForNewEmails} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Check For New Emails
          </Button>
          <Button variant="outline" size="sm" onClick={handleTestEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Create Test Email
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
              to process it. This will create a new lead from the test email. In a production environment, this process would happen 
              automatically when emails are received.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailWorkflowSettings;
