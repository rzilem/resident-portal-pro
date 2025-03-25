
import React from 'react';
import EmailWorkflowSettings from '@/components/settings/email-workflows/EmailWorkflowSettings';

const EmailWorkflows = () => {
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Email Workflow Settings</h1>
        <p className="text-muted-foreground">
          Manage how incoming emails are routed and which workflows they trigger
        </p>
      </div>
      
      <EmailWorkflowSettings />
    </div>
  );
};

export default EmailWorkflows;
