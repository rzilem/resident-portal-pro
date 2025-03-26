
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EmailWorkflowSettings from '@/components/settings/email-workflows/EmailWorkflowSettings';

const EmailWorkflows: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Email Workflows</h1>
        <p className="text-muted-foreground">Configure how emails are processed and routed in your organization</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <EmailWorkflowSettings />
        
        <Card>
          <CardHeader>
            <CardTitle>Email Workflow Documentation</CardTitle>
            <CardDescription>
              Learn how to use email workflows effectively
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">What are Email Workflows?</h3>
                <p className="text-muted-foreground">
                  Email workflows allow you to automatically process incoming emails based on predefined rules. 
                  This helps streamline communication and ensures messages are routed to the appropriate 
                  department or trigger specific actions.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Common Use Cases</h3>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Route maintenance requests to your maintenance team</li>
                  <li>Process violation reports automatically</li>
                  <li>Forward account inquiries to accounting department</li>
                  <li>Convert emailed documents to attachments in resident profiles</li>
                  <li>Create calendar events from emailed meeting requests</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Best Practices</h3>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Use clear, specific inbound email addresses (e.g., maintenance@yourcompany.com)</li>
                  <li>Set up appropriate forwarding destinations</li>
                  <li>Review workflow logs regularly to ensure proper functioning</li>
                  <li>Test new workflows before deploying them</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailWorkflows;
