
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TooltipButton } from '@/components/ui/tooltip-button';

const EmailWorkflows: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Email Workflows</h1>
          <p className="text-muted-foreground">
            Manage automated email workflows and triggers
          </p>
        </div>
        <TooltipButton 
          tooltipText="Create a new email workflow"
          variant="default"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Workflow
        </TooltipButton>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground py-8">
            Email Workflows management is coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailWorkflows;
